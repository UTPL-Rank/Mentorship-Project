import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AcademicPeriodsService } from '../../core/services/academic-period.service';
import { Student, Students } from '../../models/models';
import { MentorsService } from './mentors.service';

const STUDENTS_COLLECTION_NAME = 'students';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly perf: AngularFirePerformance,
    private readonly periodsService: AcademicPeriodsService,
    private readonly mentorsService: MentorsService
  ) { }

  getStudentDocument(studentId: string): AngularFirestoreDocument<Student> {
    return this.angularFirestore.collection(STUDENTS_COLLECTION_NAME).doc(studentId);
  }

  public getStudentsOfMentorAndShare(mentorId: string, periodId: string): Observable<Students> {
    return this.angularFirestore.collection<Student>(
      STUDENTS_COLLECTION_NAME,
      query => {
        const periodRef = this.periodsService.periodDocument(periodId).ref;
        const mentorRef = this.mentorsService.getMentorDocument(mentorId).ref;

        return query.orderBy('displayName')
          .where('period.reference', '==', periodRef)
          .where('mentor.reference', '==', mentorRef);
      }
    )
      .valueChanges()
      .pipe(
        this.perf.trace('List mentor assigned students'),
        shareReplay(1)
      );
  }

}
