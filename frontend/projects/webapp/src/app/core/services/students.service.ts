import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Student, Students } from '../../models/models';
import { AcademicPeriodsService } from './academic-period.service';
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

  /**
   * Get the firestore collection of students
   */
  public getStudentsCollection(): AngularFirestoreCollection<Student> {
    return this.angularFirestore
      .collection<Student>(STUDENTS_COLLECTION_NAME);
  }

  /**
   * Get the firestore document of a student
   * @param studentId Identifier of the student
   */
  public getStudentDocument(studentId: string): AngularFirestoreDocument<Student> {
    return this.angularFirestore
      .collection(STUDENTS_COLLECTION_NAME)
      .doc<Student>(studentId);
  }

  /**
   * Get an observable of the student and share the response
   * @param studentId Identifier of the student
   */
  public getStudentObsAndShare(studentId: string): Observable<Student> {
    return this.getStudentDocument(studentId)
      .valueChanges()
      .pipe(
        shareReplay(1)
      );
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
