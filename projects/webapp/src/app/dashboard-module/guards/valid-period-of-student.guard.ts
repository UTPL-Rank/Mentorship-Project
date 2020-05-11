import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

/**
 * Check if request to `.../:periodId/.../:studentId` is a valid student
 * of specific period
 */
@Injectable({ providedIn: 'root' })
export class ValidPeriodOfStudentGuard implements CanActivate {
  constructor(private db: AngularFirestore) { }

  async canActivate({ params }: ActivatedRouteSnapshot) {
    const { studentId, periodId } = params;
    const periodRef = this.db.collection('academic-periods').doc(periodId).ref;

    const snap = await this.db
      .collection('students', query => {
        return query
          .where('id', '==', studentId)
          .where('period.reference', '==', periodRef);
      })
      .get()
      .toPromise();

    // validate if mentor was found or not
    return !snap.empty;
  }
}
