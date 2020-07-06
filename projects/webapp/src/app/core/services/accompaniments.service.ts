import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
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

interface QueryAccompaniments {
  orderBy?: {
    timeCreated?: firestore.OrderByDirection;
  };
  where?: {
    periodId?: string;
    semesterKind?: string;
    mentorId?: string;
    studentId?: string;
  };
  limit?: {
    start?: number;
  };
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

  private accompanimentsCollection(queryAccompaniment?: QueryAccompaniments) {

    if (!queryAccompaniment)
      return this.firestoreDB.collection<Accompaniment>(ACCOMPANIMENTS_COLLECTION_NAME);

    return this.firestoreDB.collection<Accompaniment>(
      ACCOMPANIMENTS_COLLECTION_NAME,
      query => {
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

        if (where.semesterKind) {
          q = q.where('semesterKind', '==', where.semesterKind);
        }

        // if (limit.start)
        //   return q.limit(limit.start);

        return q;
      }
    );
  }

  public accompaniments(query: QueryAccompaniments): Observable<FirestoreAccompaniments> {
    return this.accompanimentsCollection(query).get().pipe(
      map(snap => snap.docs.map(d => (d.data() as Accompaniment)))
    );
  }


  public accompanimentsStream({ mentorId, periodId, studentId }: GetAccompaniments, limit?: number): Observable<FirestoreAccompaniments> {
    return this.firestoreDB.collection<Accompaniment>(
      ACCOMPANIMENTS_COLLECTION_NAME,
      query => {
        let q = query.orderBy('timeCreated');
        if (periodId) {
          const periodRef = this.periodsService.periodDocument(periodId).ref;
          q = q.where('period.reference', '==', periodRef);
        }

        if (mentorId) {
          const mentorRef = this.mentorsService.mentorRef(mentorId);
          q = q.where('mentor.reference', '==', mentorRef);
        }

        if (studentId) {
          const studentRef = this.studentsService.studentRef(studentId);
          q = q.where('student.reference', '==', studentRef);
        }

        if (limit)
          return q.limit(limit);

        return q;
      }
    )
      .valueChanges()
      .pipe(
        this.perf.trace('List accompaniments'),
        shareReplay(1)
      );
  }

  /**
   * Get an observable of a student
   * @param periodId Identifier of the academic period
   * @param studentId IDentifier of the student
   */
  public getAccompanimentsOfStudent(periodId: string, studentId: string): Observable<FirestoreAccompaniments> {
    const periodRef = this.periodsService.periodDocument(periodId).ref;
    const studentRef = this.studentsService.studentRef(studentId);

    return this.firestoreDB.collection<Accompaniment>(
      ACCOMPANIMENTS_COLLECTION_NAME,
      query => query.orderBy('timeCreated')
        .where('period.reference', '==', periodRef)
        .where('student.reference', '==', studentRef)
    )
      .valueChanges()
      .pipe(this.perf.trace('List accompaniments'));
  }

  private accompanimentDocument(accompanimentId: string): AngularFirestoreDocument<Accompaniment> {
    return this.firestoreDB.collection('accompaniments').doc<Accompaniment>(accompanimentId);

  }

  public accompanimentStream(accompanimentId: string): Observable<Accompaniment> {
    return this.firestoreDB.collection(ACCOMPANIMENTS_COLLECTION_NAME).doc<Accompaniment>(accompanimentId)
      .valueChanges()
      .pipe(this.perf.trace('get accompaniment stream'));
  }

  public async saveStudentValidation(accompanimentId: string, confirmation: ReviewFormValue): Promise<void> {
    const batch = this.firestoreDB.firestore.batch();
    const accompanimentRef = this.accompanimentDocument(accompanimentId).ref;

    batch.set(
      accompanimentRef,
      { timeConfirmed: firestore.FieldValue.serverTimestamp(), reviewKey: null, confirmation },
      { merge: true }
    );

    return await batch.commit();
  }


  public accompanimentExists({ where, accompanimentId }: QueryAccompaniments): Observable<boolean> {
    return this.accompanimentsCollection({ where, accompanimentId }).get().pipe(
      map(snap => !snap.empty)
    );
  }

  public async saveAccompaniment(mentorId: string, data: AccompanimentFormValue): Promise<Accompaniment> {
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
    console.log('TODO: change to one reference');
    batch.update(mentorReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
    batch.update(mentorReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());
    batch.update(studentReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
    batch.update(studentReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());

    await batch.commit();
    return accompaniment as Accompaniment;
  }


  private async uploadFiles(files: File[]): Promise<AccompanimentAssets> {
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
