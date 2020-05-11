import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFirePerformance } from "@angular/fire/performance";
import { Mentor, Mentors } from "projects/webapp/src/app/models/models";
import { Subscription } from "rxjs";

@Component({
  selector: "sgm-mentors-analytics",
  templateUrl: "./mentors-analytics.page.html"
})
export class MentorsAnalyticsPage implements OnInit, OnDestroy {
  constructor(
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  private sub: Subscription;
  public mentors: Mentors;
  loaded = false;

  ngOnInit() {
    this.sub = this.db
      .collection<Mentor>("mentors", q => {
        const query = q;
        // TODO: fix this
        // const query = q.where("periodReference", "==", this.period.currentRef);

        return query;
      })
      .valueChanges()
      .pipe(this.perf.trace("list mentors"))
      .subscribe(mentors => {
        this.mentors = mentors;
        this.loaded = true;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  get ceroMentors() {
    return this.mentors.filter(mentor => mentor.stats.accompanimentsCount === 0);
  }
}
