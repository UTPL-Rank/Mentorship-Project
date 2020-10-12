import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'sgm-dashboard-topbar',
  templateUrl: './dashboard-topbar.component.html',
  styleUrls: ['./dashboard-topbar.component.scss']
})
export class DashboardTopbarComponent implements OnInit {
  constructor(
    private readonly auth: UserService,
    public readonly dashboard: DashboardService
  ) { }

  ngOnInit() { }

  async logout() {
    await this.auth.signOut(['/']);
    alert('Se cerro sesión correctamente.');
  }
}
