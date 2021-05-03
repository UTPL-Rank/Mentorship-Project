import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { IStatusData } from '../../../shared/modules/i-status-data';
import { IAnalyticsService } from '../../models/i-analytics-service';
import { StudentsAnalyticsService } from './students-analytics.service';

@Component({
  selector: 'sgm-students-analytics',
  templateUrl: './students-analytics.page.html',
  providers: [
    { provide: IAnalyticsService, useClass: StudentsAnalyticsService }
  ]
})
export class StudentsAnalyticsComponent implements OnDestroy {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly studentAnalytics: IAnalyticsService<SGMAnalytics.StudentsAnalytics>,
  ) { }

  private updatingDataSub: Subscription | null = null;

  private response$: Observable<IStatusData<SGMAnalytics.StudentsAnalytics>> = this.route.params.pipe(
    switchMap(params => this.studentAnalytics.get$(params.periodId)),
    shareReplay(1),
  );

  public analytics$: Observable<SGMAnalytics.StudentsAnalytics | null> = this.response$.pipe(
    map(response => response.status === 'READY' ? response.data : null)
  );

  public readonly ready$: Observable<boolean> = this.response$.pipe(map(response => response.status === 'READY'));
  public readonly loading$: Observable<boolean> = this.response$.pipe(map(response => response.status === 'LOADING'));
  public readonly error$: Observable<boolean> = this.response$.pipe(map(response => response.status === 'ERROR'));

  public readonly continuos$: Observable<Array<SGMAnalytics.StudentEntry>> = this.analytics$.pipe(
    map(analytics => analytics?.students.filter(s => s.cycle === 'sgm#second') || []),
  );

  public readonly firstTime$: Observable<Array<SGMAnalytics.StudentEntry>> = this.analytics$.pipe(
    map(analytics => analytics?.students.filter(s => s.cycle === 'sgm#first') || []),
  );

  public selectedArea: string | null = null;
  public selectedDegree: string | null = null;

  ngOnDestroy(): void {
    this.updatingDataSub?.unsubscribe();
  }

  public updateAnalytics(): void {
    const task = this.route.params.pipe(
      take(1),
      switchMap(params => this.studentAnalytics.update$(params.periodId)),
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
