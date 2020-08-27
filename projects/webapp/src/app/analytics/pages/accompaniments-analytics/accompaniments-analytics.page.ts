import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFirePerformance } from "@angular/fire/performance";
import { Accompaniment, FirestoreAccompaniments } from "projects/webapp/src/app/models/models";
import { Subscription } from "rxjs";

@Component({
  selector: "sgm-accompaniments-analytics",
  templateUrl: "./accompaniments-analytics.page.html"
})
export class AccompanimentsAnalyticsPage implements OnInit, OnDestroy {
  constructor(
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  private sub: Subscription;
  private $accompaniments: FirestoreAccompaniments;
  public accompaniments: FirestoreAccompaniments;
  loaded = false;

  public selectedArea: string = null;
  public selectedDegree: string = null;

  ngOnInit() {
    this.sub = this.db
      .collection<Accompaniment>("accompaniments", q => {
        const query = q;
        // TODO: fix this
        // const query = q.where("periodReference", "==", this.period.currentRef);

        return query;
      })
      .valueChanges()
      .pipe(
        this.perf.trace("list accompaniments")
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
