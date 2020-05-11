import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AcademicPeriod, Mentor, Student, Students } from '../../../models/models';

@Component({
  selector: 'sgm-mentor-profile-page',
  templateUrl: './mentor-profile-page.component.html'
})
export class MentorProfilePageComponent implements OnInit, OnDestroy {
  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  public students: Observable<Students>;
  public mentor: Observable<Mentor>;
  public period: AcademicPeriod;
  private sub: Subscription;

  ngOnInit() {
    this.sub = this.route.data
      .subscribe(({ activePeriod }) => this.period = activePeriod);

    this.mentor = this.route.params
      .pipe(
        this.perf.trace('Load mentor information'),
        map(params => params.mentorId as string),
        map(mentorId => this.db.collection('mentors').doc<Mentor>(mentorId)),
        switchMap(document => document.valueChanges()),
        tap(mentor => this.title.setTitle(`Estudiantes de ${mentor.displayName.toUpperCase()}`)),
        shareReplay(1)
      );

    this.students = this.route.params
      .pipe(
        this.perf.trace('List mentor assigned students'),
        map(params => params.mentorId as string),
        map(mentorId => this.db.collection('mentors').doc(mentorId).ref),
        map(mentorRef => this.db.collection<Student>('students', q => q.where('mentor.reference', '==', mentorRef).orderBy('displayName'))),
        switchMap(document => document.valueChanges()),
        shareReplay(1)
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
