import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Student, StudentReference, Students } from '../../models/models';
import { AcademicPeriodsService } from './academic-periods.service';
import { BrowserLoggerService } from './browser-logger.service';
import { MentorsService } from './mentors.service';

const STUDENTS_COLLECTION_NAME = 'students';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly perf: AngularFirePerformance,
    private readonly periodsService: AcademicPeriodsService,
    private readonly mentorsService: MentorsService,
    private readonly fireFunctions: AngularFireFunctions,
    private readonly logger: BrowserLoggerService,
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
  private studentDocument(studentId: string): AngularFirestoreDocument<Student> {
    return this.angularFirestore
      .collection(STUDENTS_COLLECTION_NAME)
      .doc<Student>(studentId);
  }

  public student(studentId: string): Observable<Student> {
    return this.studentDocument(studentId).get().pipe(
      map(snap => (snap.data() as Student))
    );
  }

  public studentRef(studentId: string): StudentReference {
    return this.studentDocument(studentId).ref as StudentReference;
  }

  /**
   * Get an observable of the student and share the response
   * @param studentId Identifier of the student
   */
  public studentStream(studentId: string): Observable<Student> {
    return this.studentDocument(studentId).valueChanges()
      .pipe(
        this.perf.trace('stream student'),
        shareReplay(1)
      );
  }

  public getStudentsOfMentorAndShare(mentorId: string, periodId: string): Observable<Students> {
    return this.angularFirestore.collection<Student>(
      STUDENTS_COLLECTION_NAME,
      query => {
        const periodRef = this.periodsService.periodDocument(periodId).ref;
        const mentorRef = this.mentorsService.mentorRef(mentorId);

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

  public transferStudent$(data: TransferStudentDTO): Observable<boolean> {
    const endpoint = this.fireFunctions.httpsCallable<TransferStudentDTO, boolean>('TransferStudent');
    const transferTask = endpoint(data).pipe(
      catchError(err => {
        this.logger.error(err);
        return of(false);
      })
    );

    return transferTask;
  }

}

interface TransferStudentDTO {
  newMentorId: string;
  studentId: string;
}
