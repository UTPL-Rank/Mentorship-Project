import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'sgm-dashboard-home',
  templateUrl: './dashboard-home.page.html'
})
export class DashboardHomePage implements OnInit {
  constructor(
    private readonly auth: AuthenticationService,
    private readonly title: TitleService,
  ) { }

  user: Observable<User> = this.auth.currentUser;

  async ngOnInit() {
    this.title.setTitle('Panel de Control');
  }
}
