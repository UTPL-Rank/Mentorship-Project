import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { FirestoreAccompaniment, FirestoreAccompaniments } from '../../models/models';
import { AcademicPeriodsService } from './academic-period.service';
import { MentorsService } from './mentors.service';
import { StudentsService } from './students.service';

const ACCOMPANIMENTS_COLLECTION_NAME = 'accompaniments';

interface GetAccompaniments {
  mentorId: string;
  studentId: string;
  periodId: string;
}

@Injectable({ providedIn: 'root' })
export class AccompanimentsService {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly perf: AngularFirePerformance,
    private readonly periodsService: AcademicPeriodsService,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService
  ) { }


  public getAccompanimentsAndShare({ mentorId, periodId, studentId }: GetAccompaniments, limit?: number): Observable<FirestoreAccompaniments> {
    return this.angularFirestore.collection<FirestoreAccompaniment>(
      ACCOMPANIMENTS_COLLECTION_NAME,
      query => {
        let q = query.orderBy('timeCreated');
        if (periodId) {
          const periodRef = this.periodsService.periodDocument(periodId).ref;
          q = q.where('period.reference', '==', periodRef);
        }

        if (mentorId) {
          const mentorRef = this.mentorsService.getMentorDocument(mentorId).ref;
          q = q.where('mentor.reference', '==', mentorRef);
        }

        if (studentId) {
          const studentRef = this.studentsService.getStudentDocument(studentId).ref;
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
}
