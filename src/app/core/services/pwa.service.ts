import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { SwUpdate } from '@angular/service-worker';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { BrowserLoggerService } from './browser-logger.service';
import { UserService } from './user.service';

export interface SaveMessagingToken {
  username: string;
  token: string;
}

/**
 * @author Bruno Esparza
 *
 * Service to handle progressive web app features
 * - push notifications
 * - service worker
 *
 * Push notifications are managed by the Angularfire library.To enable messaging features add the
 * AngularFireMessagingModule to the firebase module, and add the `firebase-messaging-sw.js` to
 * the project assets
 *
 * Service worker is managed by the angular pwa subscription
 */
@Injectable({ providedIn: 'root' })
export class PwaService {

  constructor(
    private readonly update: SwUpdate,
    private readonly messaging: AngularFireMessaging,
    private readonly logger: BrowserLoggerService,
    private readonly functions: AngularFireFunctions,
    private readonly user: UserService,
  ) { }

  /**
   * track new page version available subscription
   */
  private updateSub: Subscription | null = null;

  /**
   * track notifications subscription
   */
  private notificationsSub: Subscription | null = null;

  /**
   * Wether push notifications are enabled or not
   */
  public isPushEnabled: Observable<boolean> = combineLatest([this.user.username, this.user.currentUserData]).pipe(
    map(([username, data]) => data && data.notificationTopics && data.notificationTopics.includes(`user-${username}`)),
  );

  /**
   * start the `updates checker` to check for a new version of the application is available
   */
  initUpdateChecker(): void {
    this.updateSub = this.update.available
      .subscribe(_ => {
        const reload = confirm('Hay una nueva versión de la página, Actualizar ahora?');

        if (reload)
          window.location.reload();
      });
  }

  /**
   * start the service to listen for incoming push notifications
   */
  initPushNotifications(): void {
    this.notificationsSub = this.messaging.messages.subscribe((payload: any) => {
      const notification = new Notification(payload.title);
      console.log(notification);
    });
  }

  /**
   * Remove all subscriptions to updates and notifications. dispose service
   */
  public disposePWA() {
    this.updateSub?.unsubscribe();
    this.notificationsSub?.unsubscribe();
  }

  /**
   * Request user permission to send push notifications.
   * Store user keys to send notifications in a server.
   * Also log events like accepted or denied request to analytics
   */
  requestPushAccess(): Observable<boolean> {
    const requestAndSave = this.messaging.requestToken.pipe(
      switchMap(token => this.saveToken(token as string)),
      switchMap(saved => this.logger.info$(saved ? 'request-push-access-accepted' : 'request-push-access-denied', saved)),
      catchError((err) => {
        console.log('TODO: other scenarios');
        console.log(err);
        return of(false);
      }),
    );

    return requestAndSave;
  }

  /**
   * Save the obtained token to send push notifications via a
   * firebase function to make the transaction secure.
   * Asume the token received is from the current signed in user
   *
   * @param token to be saved in the database
   */
  private saveToken(token: string): Observable<boolean> {
    const action = this.functions.httpsCallable<SaveMessagingToken, boolean>('SaveMessagingToken');

    const tokenSaved = this.user.username.pipe(
      switchMap(username => username ? action({ username, token }) : of(false)),
      tap(console.log),
      take(1),
    );

    return tokenSaved;
  }

  /**
   * Remove push notification permission to send notification
   *
   * Remove key form server
   */
  removePushAccess(): Observable<boolean> {
    const removeAction = this.messaging.getToken.pipe(
      switchMap(token => this.removeToken(token as string)),
      catchError(_ => of(false)),
      switchMap(saved => this.logger.info$(saved ? 'remove-push-access-success' : 'remove-push-access-fail', saved)),
    );

    return removeAction;
  }

  /**
   * Remove the token to of the user via a
   * firebase function to make the transaction secure.
   * Asume the token received is from the current signed in user
   *
   * @param token to be removed
   */
  private removeToken(token: string): Observable<boolean> {
    const user = this.user.username;
    const action = this.functions.httpsCallable<SaveMessagingToken, boolean>('RemoveMessagingToken');

    const tokenRemoved = this.messaging.deleteToken(token).pipe(
      switchMap(() => user),
      switchMap(username => username ? action({ username, token }) : of(false)),
      take(1),
    );

    return tokenRemoved;
  }
}
