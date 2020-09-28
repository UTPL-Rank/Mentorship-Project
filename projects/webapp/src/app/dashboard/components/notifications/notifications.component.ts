import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { PwaService } from '../../../core/services/pwa.service';
import { Notification } from '../../../models/models';

@Component({
  selector: 'sgm-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  public notifications: Array<Notification>;

  public showEnableNotifications = this.pwa.isPushEnabled.pipe(
    map(enabled => !enabled)
  );

  private notificationsSub: Subscription;

  private messagingRequestSub: Subscription | null = null;

  constructor(
    private readonly auth: AuthenticationService,
    private readonly router: Router,
    private readonly pwa: PwaService,
  ) { }

  ngOnInit() {
    this.notificationsSub = this.auth.notificationsStream.subscribe(
      notifications => this.notifications = notifications
    );
  }

  ngOnDestroy() {
    this.notificationsSub.unsubscribe();
    this.messagingRequestSub?.unsubscribe();
  }

  async handleRedirect(notification: Notification) {
    const update = this.auth.toggleNotificationRead(notification.id).pipe(
      mergeMap(async _ => await this.router.navigateByUrl(notification.redirect)),
    );

    await update.toPromise();
  }

  get unread(): boolean {
    return this.notifications.some(n => !n.read);
  }

  public requestSubscription(): void {
    if (!!this.messagingRequestSub)
      return;

    this.messagingRequestSub = this.pwa.requestPushAccess().subscribe((saved) => {
      alert(saved ? 'A partir de ahora recibirás notificaciones.' : 'Ocurrió un error, vuelve a intentarlo.');

      this.messagingRequestSub.unsubscribe();
      this.messagingRequestSub = null;
    });
  }

  public removeMessaging(): void {
    this.pwa.removePushAccess().subscribe(console.log);
  }
}
