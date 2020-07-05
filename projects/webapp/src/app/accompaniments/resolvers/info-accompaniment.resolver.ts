import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreAccompaniment } from '../../models/accompaniment.model';

@Injectable({ providedIn: 'root' })
export class InfoAccompanimentResolver implements Resolve<FirestoreAccompaniment> {
  constructor(
    private db: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private perf: AngularFirePerformance
  ) { }

  resolve({
    params: { accompanimentId }
  }: ActivatedRouteSnapshot): Observable<FirestoreAccompaniment> {
    return this.db
      .collection('accompaniments')
      .doc<FirestoreAccompaniment>(accompanimentId)
      .get()
      .pipe(
        this.perf.trace('info accompaniment'),
        map(snap => snap.data() as FirestoreAccompaniment)

      );
  }
}
