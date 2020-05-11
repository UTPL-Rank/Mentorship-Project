import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

/**
 * Check if request to `.../:periodId/.../:accompanimentId` is a valid accompaniment
 * of specific period
 */
@Injectable({ providedIn: 'root' })
export class ValidPeriodOfAccompanimentGuard implements CanActivate {
  constructor(private db: AngularFirestore) { }

  async canActivate({ params }: ActivatedRouteSnapshot) {
    const { accompanimentId, periodId } = params;
    const periodRef = this.db.collection('academic-periods').doc(periodId).ref;

    const snap = await this.db
      .collection('accompaniments', query => {
        return query
          .where('id', '==', accompanimentId)
          .where('period.reference', '==', periodRef);
      })
      .get()
      .toPromise();

    // validate if mentor was found or not
    return !snap.empty;
  }
}
