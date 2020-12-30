import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { DashboardService } from '../../../core/services/dashboard.service';
import { IAnalyticsService } from '../../models/i-analytics-service';
import { IStatusData } from '../../models/i-status-data';
import { MentorsAnalyticsService } from './mentors-analytics.service';

@Component({
  selector: 'sgm-mentors-analytics',
  templateUrl: './mentors-analytics.page.html',
  providers: [{ provide: IAnalyticsService, useClass: MentorsAnalyticsService }]
})
export class MentorsAnalyticsPage implements OnInit, OnDestroy {

  constructor(
    private readonly analytics: IAnalyticsService<SGMAnalytics.MentorsAnalytics>,
    private readonly route: ActivatedRoute,
    private readonly dashboard: DashboardService,
  ) { }

  private updatingDataSub: Subscription | null = null;

  private response$: Observable<IStatusData<SGMAnalytics.MentorsAnalytics>> = this.route.params.pipe(
    switchMap(params => this.analytics.get$(params.periodId)),
    shareReplay(1),
  );

  public analytics$: Observable<SGMAnalytics.MentorsAnalytics | null> = this.response$.pipe(
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

  ngOnInit() {
    this.dashboard.setTitle('SGM Analíticas');
  }

  ngOnDestroy() {
    this.updatingDataSub?.unsubscribe();
  }

  public updateMentorsAnalytics() {
    const task = this.route.params.pipe(
      take(1),
      switchMap(params => this.analytics.update$(params.periodId)),
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
