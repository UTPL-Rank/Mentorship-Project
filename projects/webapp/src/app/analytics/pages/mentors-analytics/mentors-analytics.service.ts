import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirePerformance } from '@angular/fire/performance';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, startWith, tap } from 'rxjs/operators';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { IAnalyticsService } from '../../models/i-analytics-service';
import { IStatusData } from '../../models/i-status-data';

@Injectable({ providedIn: 'root', })
export class MentorsAnalyticsService extends IAnalyticsService<SGMAnalytics.MentorsAnalytics> {

  constructor(
    private readonly database: AngularFireDatabase,
    private readonly perf: AngularFirePerformance,
    private readonly aff: AngularFireFunctions,
    private readonly logger: BrowserLoggerService,
  ) { super(); }

  get$(periodId: string): Observable<IStatusData<SGMAnalytics.MentorsAnalytics>> {
    const id = `analytics/${periodId}-mentor`;

    return this.database.object<SGMAnalytics.MentorsAnalytics>(id).valueChanges().pipe(
      mergeMap(async data => {
        await this.perf.trace('analytics-get-mentors');

        const res: IStatusData<SGMAnalytics.MentorsAnalytics> = {
          data,
          status: 'READY'
        };

        return res;
      }),
      catchError(err => {
        this.logger.error('Error fetching data', err);
        const res: IStatusData<SGMAnalytics.MentorsAnalytics> = { status: 'ERROR' };
        return of(res);
      }),
      startWith({ status: 'LOADING' } as IStatusData<SGMAnalytics.MentorsAnalytics>),
      tap(console.log),
    );
  }

  update$(periodId: string): Observable<boolean> {
    const callable = this.aff.httpsCallable<{}, boolean>('AnalyticsMentorsUseCaseCaller');
    const task = callable({ periodId }).pipe(
      mergeMap(async res => {
        await this.perf.trace('analytics-mentors-use-case-caller');
        return res;
      }),
    );
    return task;
  }

}
