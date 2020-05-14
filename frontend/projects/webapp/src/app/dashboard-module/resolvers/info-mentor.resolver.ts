import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mentor } from '../../models/mentor.model';

@Injectable({ providedIn: 'root' })
export class InfoMentorResolver implements Resolve<Mentor> {
  constructor(
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<Mentor> {
    return this.db
      .collection('mentors')
      .doc(params.mentorId)
      .get()
      .pipe(
        this.perf.trace('info mentor'),
        map(snap => snap.data() as Mentor)
      );
  }
}