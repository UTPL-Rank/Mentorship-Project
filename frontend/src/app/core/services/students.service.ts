import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirePerformance } from '@angular/fire/performance';
import { SGMStudent } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { Observable, of } from 'rxjs';
import {catchError, map, mergeMap, shareReplay, tap} from 'rxjs/operators';
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
  public getStudentsCollection(): AngularFirestoreCollection<SGMStudent.readDTO> {
    return this.angularFirestore
      .collection<SGMStudent.readDTO>(STUDENTS_COLLECTION_NAME);
  }

  // public getStudentsOfMentorCollection(mentorId: string): AngularFirestoreCollection<SGMStudent.readDTO> {
  //   const mentorRef = this.mentorsService.mentorRef(mentorId);
  //   return this.angularFirestore
  //     .collection<SGMStudent.readDTO>(STUDENTS_COLLECTION_NAME,
  //       query => {
  //         return query.orderBy('displayName')
  //           .where('mentor.reference', '==', mentorRef);
  //       });
  // }

  /**
   * Get the firestore document of a student
   * @param studentId Identifier of the student
   */
  private studentDocument(studentId: string): AngularFirestoreDocument<SGMStudent.readDTO> {
    return this.angularFirestore
      .collection(STUDENTS_COLLECTION_NAME)
      .doc<SGMStudent.readDTO>(studentId);
  }

  public student(studentId: string): Observable<SGMStudent.readDTO> {
    return this.studentDocument(studentId).get().pipe(
      map(snap => (snap.data() as SGMStudent.readDTO))
    );
  }

  public studentRef(studentId: string): firestore.DocumentReference<SGMStudent.readDTO> {
    return this.studentDocument(studentId).ref as firestore.DocumentReference<SGMStudent.readDTO>;
  }

  /**
   * Get an observable of the student and share the response
   * @param studentId Identifier of the student
   */
  public studentStream(studentId: string): Observable<SGMStudent.readDTO> {
    return this.studentDocument(studentId).valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.perf.trace('stream-student');
          return doc as any;
        }),
        shareReplay(1)
      );
  }

  public getStudentsOfMentor(mentorId: string): Observable<Array<SGMStudent.readDTO>> {
    const mentorRef = this.mentorsService.mentorRef(mentorId);

    return this.angularFirestore.collection<SGMStudent.readDTO>(
      STUDENTS_COLLECTION_NAME,
      query => {
        return query.orderBy('displayName')
          .where('mentor.reference', '==', mentorRef);
      }
    )
      .valueChanges()
      .pipe(
            mergeMap(async doc => {
              await this.perf.trace('list-assigned-students');
              return doc;
            }),
          shareReplay(1)
      );
  }

  public list$(options: { periodId?: string, mentorId?: string, limit: number }): Observable<Array<SGMStudent.readDTO>> {
    return this.angularFirestore.collection<SGMStudent.readDTO>(
      STUDENTS_COLLECTION_NAME,
      q => {
        let query = q.orderBy('displayName');

        if (options.periodId) {
          const periodRef = this.periodsService.periodDocument(options.periodId).ref;
          query = query.where('period.reference', '==', periodRef);
        }

        if (options.mentorId) {
          const mentorRef = this.mentorsService.mentorRef(options.mentorId);
          query = query.where('mentor.reference', '==', mentorRef);
        }

        query = query.limit(options.limit);

        return query;
      }
    )
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.perf.trace('list-mentor-assigned-students');
          return doc;
        }),
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
