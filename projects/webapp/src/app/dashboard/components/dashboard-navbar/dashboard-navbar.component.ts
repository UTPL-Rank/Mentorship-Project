import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'firebase/app';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { AcademicPeriod, UserClaims } from '../../../models/models';

@Component({
  selector: 'sgm-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.scss']
})

export class DashboardNavbarComponent implements OnInit, OnDestroy {

  public user: User;
  public claims: UserClaims;
  public activePeriod: AcademicPeriod;

  private sub: Subscription;

  constructor(
    private readonly auth: UserService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit() {
    const dataStream = combineLatest([
      this.auth.currentUser,
      this.auth.claims,
      this.route.data.pipe(map(d => d.activePeriod as AcademicPeriod)),
    ]);

    this.sub = dataStream.subscribe(([user, claims, period]) => {
      this.user = user;
      this.claims = claims;
      this.activePeriod = period;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
