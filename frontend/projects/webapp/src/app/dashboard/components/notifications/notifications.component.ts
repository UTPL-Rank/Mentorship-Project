import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Notification } from '../../../models/models';

@Component({
  selector: 'sgm-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  constructor(
    public readonly auth: AuthenticationService,
    private readonly router: Router,
  ) { }

  async handleRedirect(n: Notification) {
    const update = this.auth.toggleNotificationRead(n.id).pipe(
      mergeMap(async _ => await this.router.navigateByUrl(n.redirect)),
    );

    await update.toPromise();
  }
}
