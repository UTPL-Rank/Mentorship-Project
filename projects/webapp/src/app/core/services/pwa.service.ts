import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { SwUpdate } from '@angular/service-worker';
import { Observable, of } from 'rxjs';
import { catchError, map, map as tap, mergeMap, switchMap, take } from 'rxjs/operators';
import { SaveMessagingToken } from '../../models/models';
import { AuthenticationService } from './authentication.service';

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
    private readonly logger: AngularFireAnalytics,
    private readonly functions: AngularFireFunctions,
    private readonly auth: AuthenticationService,
  ) { }

  /**
   * start the `updates checker` to check for a new version of the application is available
   */
  initUpdateChecker(): void {
    this.update.available
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
    this.messaging.messages.subscribe(
      console.log
    );
  }

  /**
   * Wether push notifications are enabled or not
   */
  get isPushEnabled(): Observable<boolean> {
    // return this.messaging.;
    return this.messaging.getToken.pipe(
      tap(token => !!token)
    );
  }

  /**
   * Request user permission to send push notifications.
   * Store user keys to send notifications in a server.
   * Also log events like accepted or denied request to analytics
   */
  requestPushAccess(): Observable<boolean> {
    const requestAndSave = this.messaging.requestToken.pipe(
      switchMap(token => this.saveToken(token)),
      catchError(() => of(false)),
      mergeMap(async saved => {
        try {
          await this.logger.logEvent(saved ? 'request-push-access-denied' : 'request-push-access-accepted');
        } catch { }
        return saved;
      }),
    );

    return requestAndSave;
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
      mergeMap(async saved => {
        try {
          await this.logger.logEvent(saved ? 'remove-push-access-success' : 'remove-push-access-fail');
        } catch { }
        return saved;
      }),
    );

    return removeAction;
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
    const action = this.functions.httpsCallable<SaveMessagingToken, boolean>('saveMessagingToken');

    const tokenSaved = user.pipe(
      map(({ email }) => email.split('@')[0]),
      switchMap(username => action({ username, token })),
      take(1),
      catchError(_ => of(false))
    );

    return tokenSaved;
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
    const action = this.functions.httpsCallable<SaveMessagingToken, boolean>('removeMessagingToken');

    const tokenRemoved = this.messaging.deleteToken(token).pipe(
      switchMap(() => user),
      map(({ email }) => email.split('@')[0]),
      switchMap(username => action({ username, token })),
      take(1),
      catchError(_ => of(false))
    );

    return tokenRemoved;
  }
}
