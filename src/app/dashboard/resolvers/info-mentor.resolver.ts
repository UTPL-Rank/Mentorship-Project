import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SGMMentor } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InfoMentorResolver implements Resolve<SGMMentor.readDTO> {
  constructor(
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<SGMMentor.readDTO> {
    return this.db
      .collection('mentors')
      .doc(params.mentorId)
      .get()
      .pipe(
        mergeMap(async doc => {
          await this.perf.trace('info mentor');
          return doc;
        }),
        map(snap => snap.data() as SGMMentor.readDTO)
      );
  }
}
