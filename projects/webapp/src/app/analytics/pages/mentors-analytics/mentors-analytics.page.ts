import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase';
import { AcademicPeriod, Mentor, Mentors } from 'projects/webapp/src/app/models/models';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { TitleService } from '../../../core/services/title.service';
import { AnalyticsService } from '../../analytics.service';

@Component({
  selector: 'sgm-mentors-analytics',
  templateUrl: './mentors-analytics.page.html'
})
export class MentorsAnalyticsPage implements OnInit, OnDestroy {

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly db: AngularFirestore,
    private readonly perf: AngularFirePerformance,
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
  ) { }

  private mentorsAnalytics$: Observable<any> = this.route.params.pipe(
    switchMap(params => this.analytics.mentors$(params.periodId)),
    tap(console.log),
    shareReplay(1),
  );

  public period$: Observable<AcademicPeriod> = this.mentorsAnalytics$.pipe(
    map(data => data.period),
  );

  public lastUpdated$: Observable<firestore.Timestamp> = this.mentorsAnalytics$.pipe(
    map(data => data.lastUpdated),
  );

  private sub: Subscription;
  public mentors: Mentors;
  loaded = false;

  ngOnInit() {
    this.title.setTitle('Analíticas Mentores');

    this.sub = this.db
      .collection<Mentor>('mentors', q => {
        const query = q;
        // TODO: fix this
        // const query = q.where("periodReference", "==", this.period.currentRef);

        return query;
      })
      .valueChanges()
      .pipe(this.perf.trace('list mentors'))
      .subscribe(mentors => {
        this.mentors = mentors;
        this.loaded = true;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public updateMentorsAnalytics() {
    const task = this.analytics.updateMentors();
    task.subscribe(console.log);
  }

  get ceroMentors() {
    return this.mentors.filter(mentor => mentor.stats.accompanimentsCount === 0);
  }
}
