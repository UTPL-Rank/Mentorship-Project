import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { BrowserLoggerService } from '../../../core/services/browser-logger.service';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { IAccompanimentForm } from '../../models/i-accompaniment-form';

@Injectable({ providedIn: 'root' })
export class SaveAccompanimentService {
  constructor(
    private readonly firestoreDB: AngularFirestore,
    private readonly accompanimentsService: AccompanimentsService,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    private readonly storage: AngularFireStorage,
    private readonly logger: BrowserLoggerService,
  ) { }

  public save(mentorId: string, value: IAccompanimentForm, files: File[]): Observable<SGMAccompaniment.readDTO | null> {

    const saveProcess = from(this.createAccompanimentFromForm(mentorId, value, files)).pipe(
      tap(console.log),
      mergeMap(async acc => await this.saveInDB(acc)),
      catchError((err) => {
        this.logger.error('Error saving accompaniment', err);
        return of(null);
      })
    );

    return saveProcess;
  }

  /**
   * Create and register a new accompaniment in the platform
   *
   * @param mentorId identifier of the mentor of the student
   * @param accompaniment payload data from the form
   */
  private async saveInDB(accompaniment: SGMAccompaniment.createDTO): Promise<SGMAccompaniment.readDTO> {
    const batch = this.firestoreDB.firestore.batch();

    const mentorReference = accompaniment.mentor.reference;
    const studentReference = accompaniment.student.reference;
    const accompanimentRef = this.accompanimentsService.accompanimentRef(accompaniment.id);

    batch.set(accompanimentRef, accompaniment);
    batch.update(mentorReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
    batch.update(mentorReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());
    batch.update(mentorReference, 'students.withAccompaniments', firestore.FieldValue.arrayUnion(accompaniment.student.displayName));
    batch.update(mentorReference, 'students.withoutAccompaniments', firestore.FieldValue.arrayRemove(accompaniment.student.displayName));
    batch.update(studentReference, 'stats.accompanimentsCount', firestore.FieldValue.increment(1));
    batch.update(studentReference, 'stats.lastAccompaniment', firestore.FieldValue.serverTimestamp());

    await batch.commit();

    return accompaniment;
  }

  private async createAccompanimentFromForm(mentorId: string, form: IAccompanimentForm, files: File[]): Promise<SGMAccompaniment.createDTO> {

    let problemCount = 0;
    if (!!form.problems.academic)
      problemCount++;
    if (!!form.problems.administrative)
      problemCount++;
    if (!!form.problems.economic)
      problemCount++;
    if (!!form.problems.psychosocial)
      problemCount++;
    if (!!form.problems.connectivity)
      problemCount++;
    if (!!form.problems.other)
      problemCount++;
    if (!!form.problems.none) {
      problemCount = 0;
      form.problems.academic = false;
      form.problems.administrative = false;
      form.problems.economic = false;
      form.problems.psychosocial = false;
      form.problems.connectivity = false;
      form.problems.other = false;
      form.important = false;
    }

    const mentorReference = this.mentorsService.mentorRef(mentorId);
    const mentorSnap = await mentorReference.get();
    const mentorData = mentorSnap.data();

    const studentReference = this.studentsService.studentRef(form.studentId);
    const studentSnap = await studentReference.get();
    const studentData = studentSnap.data();

    if (!mentorData || !studentData)
      throw new Error('Mentor or Student not found');

    const kind: SGMAccompaniment.AccompanimentKind = problemCount === 0 ? 'SGM#NO_PROBLEM_ACCOMPANIMENT' : 'SGM#PROBLEM_ACCOMPANIMENT';

    const accompaniment: SGMAccompaniment.createDTO = {
      timeConfirmed: null,
      confirmation: null,
      kind,
      id: this.firestoreDB.createId(),
      mentor: {
        reference: mentorReference,
        displayName: mentorData.displayName,
        email: mentorData.email,
      },
      student: {
        reference: studentReference,
        displayName: studentData.displayName,
        email: studentData.email,
      },
      period: studentData.period,
      degree: studentData.degree,
      area: studentData.area,

      timeCreated: firestore.FieldValue.serverTimestamp() as any,
      assets: await this.uploadAccompanimentAssets(files),

      // accompaniment data
      important: form.important,

      followingKind: form.followingKind,
      semesterKind: form.semesterKind,

      problems: {
        academic: form.problems.academic,
        psychosocial: form.problems.psychosocial,
        administrative: form.problems.administrative,
        economic: form.problems.economic,
        none: form.problems.none,
        other: !!form.topic ? true : false,
        otherDescription: form.topic ? form.topic.trim() : null,
        problemCount,
      },

      reviewKey: Math.random().toString(36).substring(7),

      problemDescription: form.problemDescription ? form.problemDescription.trim() : null,
      solutionDescription: form.solutionDescription ? form.solutionDescription.trim() : null,
      topicDescription: form.topicDescription ? form.topicDescription.trim() : null,
      subproblem: form.subproblem ? form.subproblem.trim() : null,
      problematic: form.problematic ? form.problematic.trim() : null,

      schemaVersion: '2.0'
    } as any;

    /**
     * TODO: rewrite functionality
     */
    Object.keys(accompaniment).forEach(key => (accompaniment as any)[key] === undefined && delete (accompaniment as any)[key])
    Object.keys(accompaniment.problems)
      .forEach(key => ((accompaniment).problems as any)[key] === undefined && delete (accompaniment.problems as any)[key])

    return accompaniment;
  }

  /**
   * Upload assets to the cloud storage, save them in the accompaniments folder with the
   * current date.
   *
   * This method does not implement any catch error fallback, if a file can't be uploaded
   * them the hole process of saving should be aborted.
   *
   * @param files that need to be uploaded to the platform
   */
  private async uploadAccompanimentAssets(files: File[]): Promise<Array<SGMAccompaniment.Asset>> {
    const folderName = Date.now();

    // for each file, create a reference to the file being uploaded
    const paths = await Promise.all(
      files.map(
        async file => {
          const path = `/accompaniments/assets/${folderName}/${file.name}`;
          await this.storage.upload(path, file);
          return path;
        }
      )
    );

    // obtain the url of the files uploaded and the reference to the file
    const assetsData = paths.map(async path => {
      const ref = this.storage.storage.ref(path);
      const data: SGMAccompaniment.Asset = {
        name: ref.name,
        path,
        downloadUrl: await ref.getDownloadURL(),
      };

      return data;
    });

    return await Promise.all(assetsData);
  }
}
