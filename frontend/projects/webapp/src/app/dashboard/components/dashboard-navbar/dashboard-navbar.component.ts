import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'firebase/app';
import { Subscription } from 'rxjs';
import { AcademicPeriodsService } from '../../../core/services/academic-period.service';
import { AcademicPeriod, AcademicPeriods, UserClaims } from '../../../models/models';

@Component({
  selector: 'sgm-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html'
})
export class DashboardNavbarComponent implements OnInit, OnDestroy {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private periodService: AcademicPeriodsService,
    private route: ActivatedRoute
  ) { }

  private userSub: Subscription;
  private tokenSub: Subscription;
  private dataSub: Subscription;

  public activePeriod: AcademicPeriod;
  public periods: AcademicPeriods;
  public user: User;
  public claims: UserClaims;

  ngOnInit(): void {
    this.periods = this.periodService.loadedPeriods;

    this.userSub = this.afAuth.authState.subscribe(user => {
      this.user = user;
    });

    this.tokenSub = this.afAuth.idTokenResult.subscribe(token => {
      this.claims = token.claims as UserClaims;
    });

    this.dataSub = this.route.data.subscribe(data => {
      this.activePeriod = data.activePeriod;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.dataSub.unsubscribe();
    this.tokenSub.unsubscribe();
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/');
    alert('Se cerro sesión correctamente.');
  }
}
