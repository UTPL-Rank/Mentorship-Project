import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'firebase/app';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'sgm-dashboard-home',
  templateUrl: './dashboard-home.page.html'
})
export class DashboardHomePage implements OnInit, OnDestroy {
  constructor(private auth: AuthenticationService, private title: TitleService) { }

  private authSub: Subscription;
  user: User;

  async ngOnInit() {
    this.title.setTitle('Panel de Control');

    this.authSub = this.auth.currentUser
      .subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
