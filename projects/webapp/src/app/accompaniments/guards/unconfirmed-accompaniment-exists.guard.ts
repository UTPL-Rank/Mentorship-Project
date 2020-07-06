import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UnconfirmedAccompanimentExistsGuard implements CanActivate {
  constructor(private db: AngularFirestore) { }

  async canActivate({ params }: ActivatedRouteSnapshot) {
    const { studentId, accompanimentId, reviewKey } = params;
    const snap = await this.db
      .collection('accompaniments', query => {
        const studentRef = this.db.collection('students').doc(studentId).ref;
        return query
          .where('reviewKey', '==', reviewKey)
          .where('id', '==', accompanimentId)
          .where('student.reference', '==', studentRef);
      })
      .get()
      .toPromise();

    // validate if an accompaniment has been found
    if (snap.empty) {
      alert('No se encontró el acompañamiento solicitado.');
      return false;
    }

    return true;
  }
}
