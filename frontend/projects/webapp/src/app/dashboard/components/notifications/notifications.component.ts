import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Notification } from '../../../models/models';

@Component({
  selector: 'sgm-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  public notifications: Array<Notification>;

  private notificationsSub: Subscription;

  constructor(
    private readonly auth: AuthenticationService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.notificationsSub = this.auth.notificationsStream.subscribe(
      notifications => this.notifications = notifications
    );
  }

  ngOnDestroy() {
    this.notificationsSub.unsubscribe();
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

}
