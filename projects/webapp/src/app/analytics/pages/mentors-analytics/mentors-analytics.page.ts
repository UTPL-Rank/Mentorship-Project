import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase';
import { AcademicPeriod } from 'projects/webapp/src/app/models/models';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { DashboardService } from '../../../core/services/dashboard.service';
import { TitleService } from '../../../core/services/title.service';
import { AnalyticsService } from '../../analytics.service';

@Component({
  selector: 'sgm-mentors-analytics',
  templateUrl: './mentors-analytics.page.html'
})
export class MentorsAnalyticsPage implements OnInit {

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly dashboard: DashboardService,
  ) { }

  private mentorsAnalytics$: Observable<any> = this.route.params.pipe(
    switchMap(params => this.analytics.mentors$(params.periodId)),
    shareReplay(1),
  );

  public period$: Observable<AcademicPeriod> = this.mentorsAnalytics$.pipe(
    map(data => data.period),
  );

  public lastUpdated$: Observable<firestore.Timestamp> = this.mentorsAnalytics$.pipe(
    map(data => data.lastUpdated),
  );

  public mentors$: Observable<any> = this.mentorsAnalytics$.pipe(
    map(data => data.mentors),
  );

  ngOnInit() {
    this.title.setTitle('Analíticas Mentores');
    this.dashboard.setTitle('SGM Analíticas');
  }

  public updateMentorsAnalytics() {
    const task = this.analytics.updateMentors();
    task.subscribe(console.log);
  }
}
