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
export class StudentsAnalyticsService extends IAnalyticsService<SGMAnalytics.StudentsAnalytics> {

  constructor(
    private readonly database: AngularFireDatabase,
    private readonly aff: AngularFireFunctions,
    private readonly logger: BrowserLoggerService,
  ) { super(); }

  get$(periodId: string): Observable<IStatusData<SGMAnalytics.StudentsAnalytics>> {
    const id = `analytics/${periodId}-students`;

    return this.database.object<SGMAnalytics.StudentsAnalytics>(id).valueChanges().pipe(
      trace('analytics-get-students'),
      map(data => {
        const res: IStatusData<SGMAnalytics.StudentsAnalytics> = {
          data,
          status: 'READY'
        };

        return res;
      }),
      catchError(err => {
        this.logger.error('Error fetching data', err);
        const res: IStatusData<SGMAnalytics.StudentsAnalytics> = { status: 'ERROR' };
        return of(res);
      }),
      startWith({ status: 'LOADING' } as IStatusData<SGMAnalytics.StudentsAnalytics>),
      tap(data => this.logger.log('Analytics: students data retrieve', data)),
    );
  }

  update$(periodId: string): Observable<boolean> {
    const callable = this.aff.httpsCallable<{}, boolean>('AnalyticsStudentsUseCaseCaller');
    const task = callable({ periodId }).pipe(
      trace('analytics-students-use-case-caller'),
    );
    return task;
  }

}
