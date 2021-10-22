import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, shareReplay, switchMap } from 'rxjs/operators';
import { ReviewFormValue } from '../../models/review-form.model';
import { AcademicPeriodsService } from './academic-periods.service';
import { BrowserLoggerService } from './browser-logger.service';
import { MentorsService } from './mentors.service';
import { ReportsService } from './reports.service';
import { StudentsService } from './students.service';

const ACCOMPANIMENTS_COLLECTION_NAME = 'accompaniments';

interface GetAccompaniments {
  mentorId: string;
  studentId: string;
  periodId: string;
}

export interface QueryAccompaniments {
  orderBy?: {
    timeCreated?: firestore.OrderByDirection;
  };
  where?: {
    periodId?: string;
    semesterKind?: string;
    mentorId?: string;
    studentId?: string;
    isImportant?: boolean;
  };
  start?: number;
  limit?: number;
  accompanimentId?: string;
}

@Injectable({ providedIn: 'root' })
export class AccompanimentsService {
  constructor(
    private readonly firestoreDB: AngularFirestore,
    private readonly perf: AngularFirePerformance,
    private readonly periodsService: AcademicPeriodsService,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    private readonly reportsService: ReportsService,
    private readonly logger: BrowserLoggerService,
  ) { }

  public accompanimentRef(studentId: string): firestore.DocumentReference<SGMAccompaniment.readDTO> {
    return this.accompanimentDocument(studentId).ref;
  }

  public readonly importantAccompaniments$: Observable<Array<SGMAccompaniment.readDTO>>
    = this.accompaniments({ where: { isImportant: true }, limit: 10, orderBy: { timeCreated: 'desc' } });

  public validateAccompaniments$(studentId: string): Observable<Array<SGMAccompaniment.readDTO>> {
    return this.accompaniments({ where: { studentId }, orderBy: { timeCreated: 'desc' } });
  }

  public recentAccompaniments$(mentorId: string): Observable<Array<SGMAccompaniment.readDTO>> {
    return this.accompaniments({ where: { mentorId }, orderBy: { timeCreated: 'desc' }, limit: 10 });
  }

  public accompanimentsOfStudent(studentId: string): AngularFirestoreCollection<SGMAccompaniment.readDTO> {
    return this.accompanimentsCollection(
      {
        orderBy: { timeCreated: 'asc' },
        where: { studentId }
      }
    );
  }

  /** @internal query accompaniments collection */
  private accompanimentsCollection(queryAccompaniment?: QueryAccompaniments): AngularFirestoreCollection<SGMAccompaniment.readDTO> {
    // query-less collection, only get a reference to the collection
    if (!queryAccompaniment)
      return this.firestoreDB.collection<SGMAccompaniment.readDTO>(ACCOMPANIMENTS_COLLECTION_NAME);

    // accompaniment with query
    return this.firestoreDB.collection<SGMAccompaniment.readDTO>(ACCOMPANIMENTS_COLLECTION_NAME, query => {
      const { orderBy, where, limit, accompanimentId } = queryAccompaniment;

      let q = query.orderBy('timeCreated', orderBy?.timeCreated);

      if (accompanimentId)
        q = q.where('id', '==', accompanimentId);

      if (!!where?.periodId) {
        const periodRef = this.periodsService.periodDocument(where.periodId).ref;
        q = q.where('period.reference', '==', periodRef);
      }

      if (!!where?.mentorId) {
        const mentorRef = this.mentorsService.mentorRef(where.mentorId);
        q = q.where('mentor.reference', '==', mentorRef);
      }

      if (!!where?.studentId) {
        const studentRef = this.studentsService.studentRef(where.studentId);
        q = q.where('student.reference', '==', studentRef);
      }

      if (!!where?.isImportant) {
        q = q.where('important', '==', true);
      }

      if (!!where?.semesterKind) {
        q = q.where('semesterKind', '==', where.semesterKind);
      }

      if (limit)
        return q.limit(limit);

      return q;
    });
  }

  /**
   * Get a list of accompaniments, single emitting
   * @param query to fetch accompaniments
   */
  public accompaniments(query: QueryAccompaniments): Observable<Array<SGMAccompaniment.readDTO>> {
    return this.accompanimentsCollection(query).get().pipe(
      map(snap => snap.docs.map(d => (d.data())))
    );
  }

  /** @internal get the firestore document of an accompaniment */
  private accompanimentDocument(accompanimentId: string): AngularFirestoreDocument<SGMAccompaniment.readDTO> {
    return this.accompanimentsCollection().doc(accompanimentId);
  }

  /**
   * get an stream of accompaniments
   * @param accompanimentId identifier of the required accompaniment
   */
  public accompanimentStream(accompanimentId: string): Observable<SGMAccompaniment.readDTO | null> {
    return this.accompanimentDocument(accompanimentId).valueChanges().pipe(
      mergeMap(async doc => {
        await this.perf.trace('get-accompaniment-stream');
        return doc ?? null;
      }),
    );
  }

  /**
   * Get a stream list of accompaniments, single emitting
   * @param query to fetch accompaniments
   */
  public accompanimentsStream(query: QueryAccompaniments): Observable<Array<SGMAccompaniment.readDTO>> {
    return this.accompanimentsCollection(query).valueChanges().pipe(
      mergeMap(async doc => {
        await this.perf.trace('list-accompaniments');
        return doc;
      }),
      shareReplay(1)
    );
  }

  /**
   * Save the validation of an accompaniments
   * @param accompanimentId identifier of the accompaniment
   * @param confirmation data to be updated
   */
  public async saveValidation(accompanimentId: string, confirmation: ReviewFormValue): Promise<void> {
    const batch = this.firestoreDB.firestore.batch();
    const accompanimentRef = this.accompanimentDocument(accompanimentId).ref;

    batch.set(
      accompanimentRef,
      { timeConfirmed: firestore.FieldValue.serverTimestamp(), reviewKey: null, confirmation } as any,
      { merge: true }
    );

    return await batch.commit();
  }

  /**
   * Find if an accompaniment exist
   * @param query to find accompaniment
   */
  public includes({ where, accompanimentId }: QueryAccompaniments): Observable<boolean> {
    return this.accompanimentsCollection({ where, accompanimentId }).get().pipe(
      map(snap => !snap.empty)
    );
  }

  /**
   * Generate the accompaniments report
   * @param mentorId identifier of the mentor
   * @param studentId identifier of the student
   * @param semesterKind identifier of the semester to export
   * @param signature student signature
   */
  public generateReport(mentorId: string, studentId: string, semesterKind: SGMAccompaniment.SemesterType, signature: string): Observable<string> {
    const reportData = forkJoin({
      mentor: this.mentorsService.mentor(mentorId),
      student: this.studentsService.student(studentId),
      accompaniments: this.accompaniments({ orderBy: { timeCreated: 'desc' }, where: { mentorId, studentId, semesterKind } })
    });

    console.log({ orderBy: { timeCreated: 'desc' }, where: { mentorId, studentId, semesterKind } });

    const saveReport = reportData.pipe(
      map(data => Object.assign(data, { signature, semesterKind })),
      switchMap(data => this.reportsService.create(data)),
    );

    return saveReport;
  }

  public changeImportant$(accompanimentId: string, important: boolean): Observable<boolean> {
    const accompanimentDocument = this.accompanimentDocument(accompanimentId);
    const updateTask = from(accompanimentDocument.update({ important })).pipe(
      map(() => true),
      catchError(err => {
        this.logger.error('Change accompaniment important', err);
        return of(false);
      })
    );

    return updateTask;
  }

  public changeRead$(accompanimentId: string, read: boolean): Observable<boolean> {
    const accompanimentDocument = this.accompanimentDocument(accompanimentId);
    const updateTask = from(accompanimentDocument.update({ read })).pipe(
      map(() => true),
      catchError(err => {
        this.logger.error('Change accompaniment read', err);
        return of(false);
      })
    );

    return updateTask;
  }


}
