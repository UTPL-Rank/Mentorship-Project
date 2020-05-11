import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreAccompaniment, FirestoreAccompaniments } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class HistoryAccompanimentsResolver implements Resolve<FirestoreAccompaniments> {
  constructor(
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<FirestoreAccompaniments> {
    const periodRef = this.db
      .collection('academic-periods')
      .doc(params.periodId).ref;
    const mentorRef = this.db.collection('mentors').doc(params.mentorId).ref;
    const studentRef = this.db.collection('students').doc(params.studentId).ref;

    return this.db
      .collection<FirestoreAccompaniment>('accompaniments', ref => {
        return ref
          .orderBy('timeCreated', 'desc')
          .where('period.reference', '==', periodRef)
          .where('mentor.reference', '==', mentorRef)
          .where('student.reference', '==', studentRef);
      })
      .get()
      .pipe(
        this.perf.trace('history accompaniments'),
        map(({ docs }) => docs.map(d => d.data() as FirestoreAccompaniment))
      );
  }
}
