import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod } from '@utpl-rank/sgm-helpers';
import { combineLatest, iif, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { AcademicPeriodsService } from '../../../core/services/academic-periods.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'sgm-dashboard-topbar',
  templateUrl: './dashboard-topbar.component.html',
  styleUrls: ['./dashboard-topbar.component.scss']
})
export class DashboardTopbarComponent {

  constructor(
    private readonly auth: UserService,
    public readonly dashboard: DashboardService,
    private readonly periodService: AcademicPeriodsService,
    private readonly route: ActivatedRoute,
  ) { }

  private readonly selectedPeriod$: Observable<SGMAcademicPeriod.readDTO> = this.route.data.pipe(
    map(data => data.activePeriod),
  );

  public readonly selectedPeriodName$: Observable<string> = this.selectedPeriod$.pipe(
    map(period => period.name),
  );

  private readonly availableSelectPeriods$: Observable<Array<SGMAcademicPeriod.readDTO>>
    = combineLatest([this.selectedPeriod$, this.periodService.periods$]).pipe(
      map(([selected, all]) => all.filter(p => p.id !== selected.id)),
      shareReplay(1),
    );

  public readonly periods$: Observable<Array<SGMAcademicPeriod.readDTO> | null> = this.auth.isAdmin.pipe(
    switchMap(isAdmin => iif(() => isAdmin, this.availableSelectPeriods$, of(null)))
  );

  async logout() {
    await this.auth.signOut(['/']);
    alert('Se cerro sesión correctamente.');
  }
}
