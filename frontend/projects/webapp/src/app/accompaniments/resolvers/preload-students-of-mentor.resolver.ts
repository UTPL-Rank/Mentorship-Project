import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student, Students } from '../../models/student.model';

@Injectable({ providedIn: 'root' })
export class PreloadStudentsOfMentor implements Resolve<Students> {

  constructor(
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<Students> {

    const periodReference = this.db.collection('academic-periods').doc(params.periodId).ref;
    const mentorReference = this.db.collection('mentors').doc(params.mentorId).ref;

    return this.db
      .collection('students', q => {
        return q
          .where('period.reference', '==', periodReference)
          .where('mentor.reference', '==', mentorReference)
          .orderBy('displayName');
      })
      .get()
      .pipe(
        this.perf.trace('list students'),
        map(({ docs }) => docs.map(doc => doc.data() as Student))
      );
  }
}
