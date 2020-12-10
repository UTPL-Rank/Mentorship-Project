import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { ActivatedRoute } from '@angular/router';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { AcademicPeriod } from 'projects/webapp/src/app/models/models';
import { Observable, Subscription } from 'rxjs';
import { map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { TitleService } from '../../../core/services/title.service';
import { AnalyticsService } from '../../analytics.service';

@Component({
  selector: 'sgm-accompaniments-analytics',
  templateUrl: './accompaniments-analytics.page.html'
})
export class AccompanimentsAnalyticsComponent implements OnInit, OnDestroy {

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly db: AngularFirestore,
    private readonly perf: AngularFirePerformance,
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
  ) { }

  private accompanimentsAnalytics$: Observable<any> = this.route.params.pipe(
    switchMap(params => this.analytics.accompaniments$(params.periodId)),
    tap(console.log),
    shareReplay(1),
  );

  public period$: Observable<AcademicPeriod> = this.accompanimentsAnalytics$.pipe(
    map(data => data.period),
  );

  public lastUpdated$: Observable<firestore.Timestamp> = this.accompanimentsAnalytics$.pipe(
    map(data => data.lastUpdated),
  );

  // public accompanimentsCount$: Observable<Analitycs.>/

  private sub: Subscription;
  private $accompaniments: Array<SGMAccompaniment.readDTO>;
  public accompaniments: Array<SGMAccompaniment.readDTO>;
  loaded = false;

  public selectedArea: string = null;
  public selectedDegree: string = null;

  ngOnInit() {
    this.title.setTitle('Analíticas Acompañamientos');

    this.sub = this.db.collection<SGMAccompaniment.readDTO>('accompaniments', q => {
        const query = q;
        // TODO: fix this
        // const query = q.where("periodReference", "==", this.period.currentRef);

        return query;
      })
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.perf.trace('list accompaniments');
          return doc;
        }),
        // map(docs => docs.map(async doc => AccompanimentParser(doc))),
        // mergeMap(async tasks => await Promise.all(tasks)),
        // tap(data => console.log(data))
      )
      .subscribe(accompaniments => {
        this.$accompaniments = accompaniments;
        this.calculateAccompaniments();
        this.loaded = true;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public updateAccompanimentsAnalytics(): void {
    const task = this.analytics.updateAccompaniments();
    task.subscribe(console.log);
  }

  calculateAccompaniments() {
    this.accompaniments = this.$accompaniments.filter(accompaniment => {
      if (!!this.selectedArea) {
        if (this.selectedArea !== accompaniment.area.reference.id) {
          return false;
        }
      }
      if (!!this.selectedDegree) {
        if (this.selectedDegree !== accompaniment.degree.reference.id) {
          return false;
        }
      }

      return true;
    });
  }

  private onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  get areas() {
    if (!this.$accompaniments) {
      return [];
    }
    return this.$accompaniments
      .map(acc => acc.area.reference.id)
      .filter(this.onlyUnique);
  }

  get degrees() {
    if (!this.$accompaniments) {
      return [];
    }

    if (!!this.selectedArea) {
      return this.accompaniments
        .map(acc => acc.degree.reference.id)
        .filter(this.onlyUnique);
    }

    return this.$accompaniments
      .map(acc => acc.degree.reference.id)
      .filter(this.onlyUnique);
  }

  filterArea(area: string) {
    this.selectedArea = area;
    this.calculateAccompaniments();
  }

  filterDegree(degree: string) {
    this.selectedDegree = degree;
    this.calculateAccompaniments();
  }
}
