import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Mentor, Mentors } from '../../models/models';
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

  public getMentorDocument(mentorId: string): AngularFirestoreDocument<Mentor> {
    return this.getMentorsCollection().doc<Mentor>(mentorId);
  }

  /**
   * get information about an specific mentor
   * @param mentorId identifier of requested mentor
   */
  public getMentorAndShare(mentorId: string): Observable<Mentor> {
    return this.getMentorDocument(mentorId)
      .valueChanges()
      .pipe(
        this.perf.trace('load mentor information'),
        shareReplay(1)
      );
  }
}
