import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Mentor, MentorEvaluationActivities, MentorEvaluationDependencies, MentorEvaluationObservations, MentorReference, Mentors } from '../../models/models';
import { AcademicPeriodsService } from './academic-periods.service';

const MENTORS_COLLECTION_NAME = 'mentors';

@Injectable({ providedIn: 'root' })
export class MentorsService {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly perf: AngularFirePerformance,
    private readonly periodsService: AcademicPeriodsService
  ) { }

  public getMentorsCollection(periodId?: string): AngularFirestoreCollection<Mentor> {
    if (periodId) {
      const { ref } = this.periodsService.periodDocument(periodId);

      return this.angularFirestore.collection<Mentor>(MENTORS_COLLECTION_NAME, q => q
        .where('period.reference', '==', ref)
        .orderBy('displayName')
      );
    }

    return this.angularFirestore.collection<Mentor>(MENTORS_COLLECTION_NAME);
  }

  /**
   * Get mentors of an specific academic period
   * @param periodId period to get the mentors from
   */
  public getAllMentorsAndShare(periodId: string): Observable<Mentors> {
    return this.getMentorsCollection(periodId)
      .valueChanges()
      .pipe(
        this.perf.trace('list mentors'),
        shareReplay(1),
        map(mentors => [...mentors]),
      );
  }

  private mentorDocument(mentorId: string): AngularFirestoreDocument<Mentor> {
    return this.getMentorsCollection().doc(mentorId);
  }

  public mentor(mentorId: string): Observable<Mentor> {
    return this.getMentorsCollection().doc(mentorId).get().pipe(
      map(snap => (snap.data() as Mentor))
    );
  }

  public mentorRef(mentorId: string): MentorReference {
    return this.getMentorsCollection().doc(mentorId).ref as MentorReference;
  }

  /**
   * get information about an specific mentor
   * @param mentorId identifier of requested mentor
   */
  public mentorStream(mentorId: string): Observable<Mentor> {
    return this.mentorDocument(mentorId)
      .valueChanges()
      .pipe(
        this.perf.trace('load mentor information'),
        shareReplay(1)
      );
  }

  private evaluationActivitiesReference(mentorId: string): AngularFirestoreDocument {
    return this.mentorDocument(mentorId).collection('evaluation').doc('activities');
  }

  public evaluationActivities(mentorId: string): Observable<MentorEvaluationActivities | null> {
    return this.evaluationActivitiesReference(mentorId).get().pipe(
      this.perf.trace('load mentor activities evaluation'),
      map(snap => snap.data())
    );
  }

  public async saveEvaluationActivities(mentorId: string, data: MentorEvaluationActivities) {
    return await this.evaluationActivitiesReference(mentorId).set(data);
  }

  private evaluationDependenciesReference(mentorId: string): AngularFirestoreDocument {
    return this.mentorDocument(mentorId).collection('evaluation').doc('dependencies');
  }

  public evaluationDependencies(mentorId: string): Observable<MentorEvaluationDependencies | null> {
    return this.evaluationDependenciesReference(mentorId).get().pipe(
      this.perf.trace('load mentor dependencies evaluation'),
      map(snap => snap.data())
    );
  }

  public async saveEvaluationDependencies(mentorId: string, data: MentorEvaluationDependencies) {
    return await this.evaluationDependenciesReference(mentorId).set(data);
  }

  private evaluationObservationsReference(mentorId: string): AngularFirestoreDocument {
    return this.mentorDocument(mentorId).collection('evaluation').doc('observations');
  }

  public evaluationObservations(mentorId: string): Observable<MentorEvaluationObservations | null> {
    return this.evaluationObservationsReference(mentorId).get().pipe(
      this.perf.trace('load mentor observations evaluation'),
      map(snap => snap.data())
    );
  }

  public async saveEvaluationObservations(mentorId: string, data: MentorEvaluationObservations) {
    return await this.evaluationObservationsReference(mentorId).set(data);
  }
}
