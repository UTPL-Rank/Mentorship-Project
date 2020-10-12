import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/app';
import { Observable } from 'rxjs';
import { TitleService } from '../../../core/services/title.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'sgm-dashboard-home',
  templateUrl: './dashboard-home.page.html'
})
export class DashboardHomePage implements OnInit {
  constructor(
    private readonly auth: UserService,
    private readonly title: TitleService,
  ) { }

  user: Observable<User> = this.auth.currentUser;

  async ngOnInit() {
    this.title.setTitle('Panel de Control');
  }
}
