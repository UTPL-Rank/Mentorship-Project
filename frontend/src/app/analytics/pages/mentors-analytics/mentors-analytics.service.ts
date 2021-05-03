import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { trace } from '@angular/fire/performance';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { IStatusData } from '../../../shared/modules/i-status-data';
import { IAnalyticsService } from '../../models/i-analytics-service';

@Injectable({ providedIn: 'root', })
export class MentorsAnalyticsService extends IAnalyticsService<SGMAnalytics.MentorsAnalytics> {

  constructor(
    private readonly database: AngularFireDatabase,
    private readonly aff: AngularFireFunctions,
    private readonly logger: BrowserLoggerService,
  ) { super(); }

  get$(periodId: string): Observable<IStatusData<SGMAnalytics.MentorsAnalytics>> {
    const id = `analytics/${periodId}-mentors`;

    return this.database.object<SGMAnalytics.MentorsAnalytics>(id).valueChanges().pipe(
      trace('analytics-get-mentors'),
      map(data => {
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
      tap(data => this.logger.log('Analytics: mentor data retrieve', data)),
    );
  }

  update$(periodId: string): Observable<boolean> {
    const callable = this.aff.httpsCallable<{}, boolean>('AnalyticsMentorsUseCaseCaller');
    const task = callable({ periodId }).pipe(
      trace('analytics-mentors-use-case-caller'),
    );
    return task;
  }

}
