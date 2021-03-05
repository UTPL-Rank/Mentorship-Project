import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod } from '@utpl-rank/sgm-helpers';
import { User } from 'firebase/app';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { UserClaims } from '../../../models/user-claims';

@Component({
  selector: 'sgm-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.scss']
})

export class DashboardNavbarComponent implements OnInit, OnDestroy {

  public user!: User;
  public claims!: UserClaims;
  public activePeriod!: SGMAcademicPeriod.readDTO;

  private sub!: Subscription;

  constructor(
    private readonly auth: UserService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit() {
    const dataStream = combineLatest([
      this.auth.currentUser,
      this.auth.claims,
      this.route.data.pipe(map(d => d.activePeriod as SGMAcademicPeriod.readDTO)),
    ]);

    this.sub = dataStream.subscribe(([user, claims, period]) => {
      this.user = user as any;
      this.claims = claims as any;
      this.activePeriod = period;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
