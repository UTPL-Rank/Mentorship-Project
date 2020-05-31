import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { FirestoreAccompaniment } from '../../../models/accompaniment.model';
import { Mentor } from '../../../models/mentor.model';
import { AcademicPeriod } from '../../../models/models';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'sgm-accompaniments-history',
  templateUrl: './accompaniments-history.page.html'
})
export class AccompanimentsHistoryPage implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private auth: AuthenticationService) { }

  private sub: Subscription;
  private authSub: Subscription;

  public student: Student;
  public mentor: Mentor;
  public isAdmin = false;
  public period: AcademicPeriod;

  public allAccompaniments: FirestoreAccompaniment[];
  public confirmedAccompaniments: FirestoreAccompaniment[];
  public unconfirmedAccompaniments: FirestoreAccompaniment[];

  ngOnInit() {
    this.sub = this.route.data.subscribe(
      ({ accompaniments, mentor, student, activePeriod }) => {
        this.period = activePeriod;

        this.mentor = mentor;
        this.student = student;

        this.allAccompaniments = accompaniments;
        this.unconfirmedAccompaniments = this.allAccompaniments.filter(
          ac => !!ac.reviewKey
        );
        this.confirmedAccompaniments = this.allAccompaniments.filter(
          ac => !ac.reviewKey
        );
      }
    );

    this.authSub = this.auth.claims.subscribe(claims => {
      this.isAdmin = claims.isAdmin;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
