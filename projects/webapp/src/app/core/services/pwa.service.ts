import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { SwUpdate } from '@angular/service-worker';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

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
  ) { }

  /**
   * start the `updates checker` to check for a new version of the application is available
   * */
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
    return of(false);
  }

  /**
   * Request user permission to send push notifications.
   *
   * Store user keys to send notifications in a server.
   */
  requestPushAccess(): Observable<boolean> {
    const logAccepted = from(this.logger.logEvent('request-push-access-accepted')).pipe(
      map(() => true)
    );

    const logDenied = from(this.logger.logEvent('request-push-access-denied')).pipe(
      map(() => false)
    );

    const requestAndSave = from(this.logger.logEvent('request-push-access')).pipe(
      switchMap(() => this.messaging.requestToken),
      tap(console.log),
      switchMap(token => logAccepted),
      catchError(_ => logDenied),
    );

    return requestAndSave;
  }

  /**
   * Remove push notification permission to send notification
   *
   * Remove key form server
   */
  removePushAccess(): Observable<boolean> {
    const removeSuccess = from(this.logger.logEvent('remove-push-access-success')).pipe(
      map(() => true)
    );

    const removeFail = from(this.logger.logEvent('remove-push-access-fail')).pipe(
      map(() => false)
    );

    const removeAction = from(this.logger.logEvent('remove-push-access')).pipe(
      switchMap(() => this.messaging.deleteToken),
      tap(console.log),
      switchMap(_ => removeSuccess),
      catchError(_ => removeFail),
    );

    return removeAction;
  }

}
