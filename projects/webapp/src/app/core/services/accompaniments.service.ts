import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { AngularFireStorage } from '@angular/fire/storage';
import { firestore } from 'firebase/app';
import { forkJoin, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { AccompanimentFormValue } from '../../accompaniments/components/accompaniment-form/accompaniment-form.component';
import { Accompaniment, AccompanimentAsset, AccompanimentAssets, CreateFirestoreAccompaniment, FirestoreAccompaniments, FollowingKind, SemesterKind } from '../../models/models';
import { ReviewFormValue } from '../../models/review-form.model';
import { AcademicPeriodsService } from './academic-periods.service';
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
    private readonly storage: AngularFireStorage,
    private readonly reportsService: ReportsService,
  ) { }

  public readonly importantAccompaniments$: Observable<Accompaniment[]>
    = this.accompaniments({ where: { isImportant: true }, limit: 10, orderBy: { timeCreated: 'desc' } }) as Observable<Accompaniment[]>;

  public validateAccompaniments$(studentId: string): Observable<Accompaniment[]> {
    return this.accompaniments({ where: { studentId }, orderBy: { timeCreated: 'desc' } }) as Observable<Accompaniment[]>;
  }

  public recentAccompaniments$(mentorId: string): Observable<Accompaniment[]> {
    return this.accompaniments({ where: { mentorId }, orderBy: { timeCreated: 'desc' }, limit: 10 }) as Observable<Accompaniment[]>;
  }

  /** @internal query accompaniments collection */
  private accompanimentsCollection(queryAccompaniment?: QueryAccompaniments): AngularFirestoreCollection<Accompaniment> {
    // query-less collection, only get a reference to the collection
    if (!queryAccompaniment)
      return this.firestoreDB.collection<Accompaniment>(ACCOMPANIMENTS_COLLECTION_NAME);

    // accompaniment with query
    return this.firestoreDB.collection<Accompaniment>(ACCOMPANIMENTS_COLLECTION_NAME, query => {
      const { orderBy, where, limit, accompanimentId } = queryAccompaniment;

      let q = query.orderBy('timeCreated', orderBy?.timeCreated);

      if (accompanimentId)
        q = q.where('id', '==', accompanimentId);

      if (where.periodId) {
        const periodRef = this.periodsService.periodDocument(where.periodId).ref;
        q = q.where('period.reference', '==', periodRef);
      }

      if (where.mentorId) {
        const mentorRef = this.mentorsService.mentorRef(where.mentorId);
        q = q.where('mentor.reference', '==', mentorRef);
      }

      if (where.studentId) {
        const studentRef = this.studentsService.studentRef(where.studentId);
        q = q.where('student.reference', '==', studentRef);
      }

      if (where.isImportant) {
        q = q.where('important', '==', true);
      }

      if (where.semesterKind) {
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
  public accompaniments(query: QueryAccompaniments): Observable<FirestoreAccompaniments> {
    return this.accompanimentsCollection(query).get().pipe(
      map(snap => snap.docs.map(d => (d.data() as Accompaniment)))
    );
  }

  /** @internal get the firestore document of an accompaniment */
  private accompanimentDocument(accompanimentId: string): AngularFirestoreDocument<Accompaniment> {
    return this.accompanimentsCollection().doc<Accompaniment>(accompanimentId);
  }

  /**
   * get an stream of accompaniments
   * @param accompanimentId identifier of the required accompaniment
   */
  public accompanimentStream(accompanimentId: string): Observable<Accompaniment> {
    return this.accompanimentDocument(accompanimentId).valueChanges().pipe(
      this.perf.trace('get accompaniment stream')
    );
  }

  /**
   * Get a stream list of accompaniments, single emitting
   * @param query to fetch accompaniments
   */
  public accompanimentsStream(query: QueryAccompaniments): Observable<FirestoreAccompaniments> {
    return this.accompanimentsCollection(query).valueChanges().pipe(
      this.perf.trace('List accompaniments'),
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
      { timeConfirmed: firestore.FieldValue.serverTimestamp(), reviewKey: null, confirmation },
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

  public async saveAccompaniment(mentorId: string, data: AccompanimentFormValue): Promise<Accompaniment> {
    console.log('TODO: add docs');
    const mentorReference = this.mentorsService.mentorRef(mentorId);
    const mentorSnap = await mentorReference.get();
    const mentorData = mentorSnap.data();

    const studentReference = this.studentsService.studentRef(data.studentId);
    const studentSnap = await studentReference.get();
    const studentData = studentSnap.data();

    const accompaniment: CreateFirestoreAccompaniment = {
      id: this.firestoreDB.createId(),
      mentor: { ...mentorData, reference: mentorReference, },
      student: { ...studentData, reference: studentReference, },
      period: studentData.period,
      degree: studentData.degree,
      area: studentData.area,

      timeCreated: firestore.FieldValue.serverTimestamp(),
      assets: await this.uploadFiles(data.assets),

      // accompaniment data
      important: data.important,
      followingKind: data.followingKind as FollowingKind,
      semesterKind: data.semesterKind as SemesterKind,
      problemDescription: data.problemDescription,
      problems: data.problems,
      reviewKey: Math.random().toString(36).substring(7),
      solutionDescription: data.solutionDescription,
      topicDescription: data.topicDescription
    };

    // ---------------------------------
    // save on firestore
    // ---------------------------------
    const accompanimentRef = this.accompanimentsCollection().doc(accompaniment.id).ref;
    const batch = this.firestoreDB.firestore.batch();

    batch.set(accompanimentRef, accompaniment);
    batch.update(mentorReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
    batch.update(mentorReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());
    batch.update(mentorReference, 'students.withAccompaniments', firestore.FieldValue.arrayUnion(studentData.displayName));
    batch.update(mentorReference, 'students.withoutAccompaniments', firestore.FieldValue.arrayRemove(studentData.displayName));
    batch.update(studentReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
    batch.update(studentReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());

    await batch.commit();
    return accompaniment as Accompaniment;
  }


  private async uploadFiles(files: File[]): Promise<AccompanimentAssets> {
    console.log('TODO: add docs');

    const now = Date.now();
    const uploadTasks = files.map(async file => {
      const path = `/accompaniments/assets/${now}/${file.name}`;
      await this.storage.upload(path, file);
      return path;
    });
    const paths = await Promise.all(uploadTasks);

    const assetsData = paths.map(async path => {
      const ref = this.storage.storage.ref(path);
      const data: AccompanimentAsset = {
        name: ref.name,
        path,
        downloadUrl: await ref.getDownloadURL(),
      };

      return data;
    });

    return Promise.all(assetsData);
  }

  /**
   * Generate the accompaniments report
   * @param mentorId identifier of the mentor
   * @param studentId identifier of the student
   * @param semesterKind identifier of the semester to export
   * @param signature student signature
   */
  public generateReport(mentorId: string, studentId: string, semesterKind: SemesterKind, signature: string): Observable<string> {
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


}
