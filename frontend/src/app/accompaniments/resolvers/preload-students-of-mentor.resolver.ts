import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SGMStudent } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class PreloadStudentsOfMentor implements Resolve<Array<SGMStudent.readDTO>> {

  constructor(
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<Array<SGMStudent.readDTO>> {

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
        mergeMap(async doc => {
          await this.perf.trace('info students');
          return doc;
        }),
        map(({ docs }) => docs.map(doc => doc.data() as SGMStudent.readDTO))
      );
  }
}
