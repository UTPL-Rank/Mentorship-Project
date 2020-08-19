import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { PwaService } from '../../../core/services/pwa.service';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'sgm-dashboard-home',
  templateUrl: './dashboard-home.page.html'
})
export class DashboardHomePage implements OnInit {
  constructor(
    private readonly auth: AuthenticationService,
    private readonly title: TitleService,
    private readonly pwa: PwaService,
  ) { }

  user: Observable<User> = this.auth.currentUser;

  async ngOnInit() {
    this.title.setTitle('Panel de Control');
  }

  enableMessaging() {
    this.pwa.requestPushAccess().subscribe(console.log);
  }

}
