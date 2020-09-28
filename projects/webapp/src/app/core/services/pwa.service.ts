import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { SaveMessagingToken } from '../../models/models';
import { AuthenticationService } from './authentication.service';
import { BrowserLoggerService } from './browser-logger.service';

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
    private readonly browserPush: SwPush,
    private readonly messaging: AngularFireMessaging,
    private readonly logger: BrowserLoggerService,
    private readonly functions: AngularFireFunctions,
    private readonly auth: AuthenticationService,
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
  public isPushEnabled: Observable<boolean> = of(this.browserPush.isEnabled);

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
    this.notificationsSub = this.messaging.messages.subscribe(
      console.log
    );
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
      switchMap(token => this.saveToken(token)),
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
    const user = this.auth.currentUser;
    const action = this.functions.httpsCallable<SaveMessagingToken, boolean>('SaveMessagingToken');

    const tokenSaved = user.pipe(
      map(({ email }) => email.split('@')[0]),
      switchMap(username => action({ username, token })),
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
      switchMap(token => this.removeToken(token)),
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
    const user = this.auth.currentUser;
    const action = this.functions.httpsCallable<SaveMessagingToken, boolean>('RemoveMessagingToken');

    const tokenRemoved = this.messaging.deleteToken(token).pipe(
      switchMap(() => user),
      map(({ email }) => email.split('@')[0]),
      switchMap(username => action({ username, token })),
      take(1),
    );

    return tokenRemoved;
  }
}
