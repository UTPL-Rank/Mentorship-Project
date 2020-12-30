import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Observable } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';

type AccompanimentAnalytics = any;
@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  constructor(
    private readonly af: AngularFirestore,
    private readonly perf: AngularFirePerformance,
    private readonly aff: AngularFireFunctions,
  ) { }

  // tslint:disable-next-line: variable-name
  private _collection = this.af.collection('analytics');


  public accompaniments$(periodId: string): Observable<AccompanimentAnalytics> {
    const doc = this._collection.doc(`${periodId}-accompaniments`);
    const analytics = doc.valueChanges().pipe(
      mergeMap(async doc => {
        await this.perf.trace('analytics-get-accompaniments');
        return doc;
      }),
      shareReplay(1),
    );

    return analytics;
  }

  public mentors$(periodId: string): Observable<any> {
    const doc = this._collection.doc(`${periodId}-mentors`);
    const analytics = doc.valueChanges().pipe(
      mergeMap(async doc => {
        await this.perf.trace('analytics-get-mentors');
        return doc;
      }),
      shareReplay(1),
    );

    return analytics;
  }

  /**
   * Update Accompaniments
   *
   * Call the firebase callable function that updates the accompaniments analytics, to update the
   * information subscribe to the task, and a boolean is returned once updated or no
   */
  public updateAccompaniments(): Observable<boolean> {
    const callable = this.aff.httpsCallable<{}, boolean>('AnalyticsAccompaniments');
    const task = callable({}).pipe(
      mergeMap(async doc => {
        await this.perf.trace('analytics-update-accompaniments');
        return doc;
      }),
    );
    return task;
  }

  /**
   * Update Mentors
   *
   * Call the firebase callable function that updates the Mentors analytics, to update the
   * information subscribe to the task, and a boolean is returned once updated or no
   */
  public updateMentors(): Observable<boolean> {
    const callable = this.aff.httpsCallable<{}, boolean>('AnalyticsMentors');
    const task = callable({}).pipe(
      mergeMap(async doc => {
        await this.perf.trace('analytics-update-Mentors');
        return doc;
      }),
    );
    return task;
  }
}
