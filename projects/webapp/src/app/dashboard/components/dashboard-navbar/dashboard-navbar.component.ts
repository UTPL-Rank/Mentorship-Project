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

  private sub: Subscription;
  private dataSub: Subscription;

  public activePeriod: AcademicPeriod;
  public periods: AcademicPeriods;
  public user: User;
  public claims: UserClaims;

  ngOnInit(): void {
    this.periods = this.periodService.loadedPeriods;

    this.sub = this.afAuth.authState.subscribe(async user => {
      try {
        this.user = user;

        const { claims } = await user.getIdTokenResult();

        this.claims = claims as UserClaims;
      } catch {
        this.claims = null;
      }
    });

    this.dataSub = this.route.data.subscribe(data => {
      this.activePeriod = data.activePeriod;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.dataSub.unsubscribe();
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/');
    alert('Se cerro sesión correctamente.');
  }
}
