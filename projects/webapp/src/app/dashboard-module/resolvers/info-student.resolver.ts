import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student } from '../../models/student.model';

@Injectable({ providedIn: 'root' })
export class InfoStudentResolver implements Resolve<Student> {
  constructor(
    private db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<Student> {
    const { studentId } = params;

    return this.db
      .collection('students')
      .doc<Student>(studentId)
      .get()
      .pipe(
        this.perf.trace('info student'),
        map(snap => snap.data() as Student)
      );
  }
}
