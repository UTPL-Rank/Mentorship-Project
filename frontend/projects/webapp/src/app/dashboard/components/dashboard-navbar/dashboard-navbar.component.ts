import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'firebase/app';
import { Subscription } from 'rxjs';
import { AcademicPeriodsService } from '../../../core/services/academic-periods.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { AcademicPeriod, AcademicPeriods, UserClaims } from '../../../models/models';

@Component({
  selector: 'sgm-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html'
})
export class DashboardNavbarComponent implements OnInit, OnDestroy {
  constructor(
    private auth: AuthenticationService,
    private periodService: AcademicPeriodsService,
    private route: ActivatedRoute
  ) { }

  private userSub: Subscription;
  private claimsSub: Subscription;
  private dataSub: Subscription;

  public activePeriod: AcademicPeriod;
  public periods: AcademicPeriods;
  public user: User;
  public claims: UserClaims;

  ngOnInit(): void {
    this.periods = this.periodService.loadedPeriods;

    this.userSub = this.auth.currentUser
      .subscribe(user => this.user = user);

    this.claimsSub = this.auth.claims
      .subscribe(claims => this.claims = claims);

    this.dataSub = this.route.data
      .subscribe(data => this.activePeriod = data.activePeriod);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.dataSub.unsubscribe();
    this.claimsSub.unsubscribe();
  }

  async logout() {
    await this.auth.signOut(['/']);
    alert('Se cerro sesión correctamente.');
  }
}
