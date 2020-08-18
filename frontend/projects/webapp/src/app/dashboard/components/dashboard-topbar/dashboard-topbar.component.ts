import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'sgm-dashboard-topbar',
  templateUrl: './dashboard-topbar.component.html',
  styleUrls: ['./dashboard-topbar.component.scss']
})
export class DashboardTopbarComponent implements OnInit {
  constructor(
    private readonly auth: AuthenticationService,
  ) { }

  ngOnInit() { }

  async logout() {
    await this.auth.signOut(['/']);
    alert('Se cerro sesión correctamente.');
  }
}
