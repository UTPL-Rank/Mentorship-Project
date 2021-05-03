import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { IStatusData } from '../../../shared/modules/i-status-data';
import { IAnalyticsService } from '../../models/i-analytics-service';
import { MentorsAnalyticsService } from './mentors-analytics.service';

@Component({
  selector: 'sgm-mentors-analytics',
  templateUrl: './mentors-analytics.page.html',
  providers: [
    { provide: IAnalyticsService, useClass: MentorsAnalyticsService },
  ]
})
export class MentorsAnalyticsPage implements OnDestroy {

  constructor(
    private readonly mentorAnalytics: IAnalyticsService<SGMAnalytics.MentorsAnalytics>,
    private readonly route: ActivatedRoute,
  ) { }

  private updatingDataSub: Subscription | null = null;

  private response$: Observable<IStatusData<SGMAnalytics.MentorsAnalytics>> = this.route.params.pipe(
    switchMap(params => this.mentorAnalytics.get$(params.periodId)),
    shareReplay(1),
  );

  public analytics$: Observable<SGMAnalytics.MentorsAnalytics | null> = this.response$.pipe(
    map(response => response.status === 'READY' ? response.data : null)
  );

  public readonly ready$: Observable<boolean> = this.response$.pipe(map(response => response.status === 'READY'));
  public readonly loading$: Observable<boolean> = this.response$.pipe(map(response => response.status === 'LOADING'));
  public readonly error$: Observable<boolean> = this.response$.pipe(map(response => response.status === 'ERROR'));

  public mentorsFirstTime$: Observable<Array<SGMAnalytics.MentorEntry>> = this.analytics$.pipe(
    map(analytics => analytics?.mentors?.filter(m => m.continues) || []),
  );

  public mentorsSecondTime$: Observable<Array<SGMAnalytics.MentorEntry>> = this.analytics$.pipe(
    map(analytics => analytics?.mentors?.filter(m => !m.continues) || []),
  );

  ngOnDestroy(): void {
    this.updatingDataSub?.unsubscribe();
  }

  public updateMentorsAnalytics(): void {
    const task = this.route.params.pipe(
      take(1),
      switchMap(params => this.mentorAnalytics.update$(params.periodId)),
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
