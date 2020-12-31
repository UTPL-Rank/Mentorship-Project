import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { trace } from '@angular/fire/performance';
import { SGMAnalytics } from '@utpl-rank/sgm-helpers';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { IAnalyticsService } from '../../models/i-analytics-service';
import { IStatusData } from '../../models/i-status-data';

@Injectable({ providedIn: 'root', })
export class AccompanimentsAnalyticsService extends IAnalyticsService<SGMAnalytics.AccompanimentsAnalytics> {

  constructor(
    private readonly database: AngularFireDatabase,
    private readonly aff: AngularFireFunctions,
    private readonly logger: BrowserLoggerService,
  ) { super(); }

  get$(periodId: string): Observable<IStatusData<SGMAnalytics.AccompanimentsAnalytics>> {
    const id = `analytics/${periodId}-accompaniments`;

    return this.database.object<SGMAnalytics.AccompanimentsAnalytics>(id).valueChanges().pipe(
      trace('analytics-get-accompaniments'),
      map(data => {
        const res: IStatusData<SGMAnalytics.AccompanimentsAnalytics> = {
          data,
          status: 'READY'
        };

        return res;
      }),
      catchError(err => {
        this.logger.error('Error fetching data', err);
        const res: IStatusData<SGMAnalytics.AccompanimentsAnalytics> = { status: 'ERROR' };
        return of(res);
      }),
      startWith({ status: 'LOADING' } as IStatusData<SGMAnalytics.AccompanimentsAnalytics>),
      tap(data => this.logger.log('Analytics: accompaniments data retrieve', data)),
    );
  }

  update$(periodId: string): Observable<boolean> {
    const callable = this.aff.httpsCallable<{}, boolean>('AnalyticsAccompanimentsUseCaseCaller');
    const task = callable({ periodId }).pipe(
      trace('analytics-accompaniments-use-case-caller'),
    );
    return task;
  }

}
