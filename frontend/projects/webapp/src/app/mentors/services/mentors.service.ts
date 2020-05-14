import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Mentor } from '../../models/models';

interface QueryMentors {
  periodReference: DocumentReference;
  orderBy: 'displayName' | 'stats.accompanimentsCount' | 'stats.assignedStudentCount';
  startAt?: number;
  noAccompaniments?: boolean;
  area?: 'tecnica';
  last?: Mentor;
}


@Injectable({ providedIn: 'root' })
export class MentorsService {
  constructor(
    private readonly db: AngularFirestore,
    private perf: AngularFirePerformance
  ) { }

  private readonly mentorsCollectionName = 'mentors';
  public readonly maxMentorsQuerySize = 5;

  public mentorsCollection({ periodReference, orderBy, last, noAccompaniments }: QueryMentors) {
    return this.db.collection<Mentor>(
      this.mentorsCollectionName,
      query => {
        let q = query
          .where('period.reference', '==', periodReference)
          .orderBy(orderBy)
          .limit(this.maxMentorsQuerySize);

        if (last)
          q = q.startAt(last[orderBy]);


        if (noAccompaniments)
          q = q.where('stats.lastAccompaniment', '==', null);

        return q;
      }
    ).valueChanges()
      .pipe(
        this.perf.trace('list mentors'),
      );
  }


}
