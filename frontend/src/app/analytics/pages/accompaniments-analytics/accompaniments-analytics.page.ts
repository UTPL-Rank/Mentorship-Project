import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { DashboardService } from '../../../core/services/dashboard.service';
import { IStatusData } from '../../../shared/modules/i-status-data';
import { IAnalyticsService } from '../../models/i-analytics-service';
import { AccompanimentsAnalyticsService } from './accompaniments-analytics.service';

@Component({
  selector: 'sgm-accompaniments-analytics',
  templateUrl: './accompaniments-analytics.page.html',
  providers: [
    { provide: IAnalyticsService, useClass: AccompanimentsAnalyticsService }
  ]
})
export class AccompanimentsAnalyticsComponent implements OnInit, OnDestroy {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly accompanimentsAnalytics: IAnalyticsService<SGMAnalytics.AccompanimentsAnalytics>,
    private readonly dashboard: DashboardService,
  ) { }

  private updatingDataSub: Subscription | null = null;

  private response$: Observable<IStatusData<SGMAnalytics.AccompanimentsAnalytics>> = this.route.params.pipe(
    switchMap(params => this.accompanimentsAnalytics.get$(params.periodId)),
    shareReplay(1),
  );

  public analytics$: Observable<SGMAnalytics.AccompanimentsAnalytics | null> = this.response$.pipe(
    map(response => response.status === 'READY' ? response.data : null)
  );

  public ready$: Observable<boolean> = this.response$.pipe(
    map(response => response.status === 'READY'),
  );

  public loading$: Observable<boolean> = this.response$.pipe(
    map(response => response.status === 'LOADING'),
  );

  public error$: Observable<boolean> = this.response$.pipe(
    map(response => response.status === 'ERROR'),
  );

  public readonly accompanimentsContinuing$ = this.analytics$.pipe(
    map(analytics => analytics?.accompaniments.filter(a => a.student.cycle !== 'sgm#first')),
  );

  public readonly accompanimentsFirsTime$ = this.analytics$.pipe(
    map(analytics => analytics?.accompaniments.filter(a => a.student.cycle === 'sgm#first')),
  );


  public selectedArea: string | null = null;
  public selectedDegree: string | null = null;

  ngOnInit() {
    this.dashboard.setTitle('SGM Analíticas');
  }

  ngOnDestroy(): void {
    this.updatingDataSub?.unsubscribe();
  }

  public updateAnalytics(): void {
    const task = this.route.params.pipe(
      take(1),
      switchMap(params => this.accompanimentsAnalytics.update$(params.periodId)),
    );

    this.updatingDataSub = task.subscribe(updated => {
      if (!updated)
        alert('No se pudo actualizar la información');

      this.updatingDataSub?.unsubscribe();
      this.updatingDataSub = null;
    });
  }

  get isUpdating(): boolean {
    return !!this.updatingDataSub;
  }
}
