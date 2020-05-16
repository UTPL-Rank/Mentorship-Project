import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AcademicPeriodsService } from '../../core/services/academic-period.service';
import { Student, Students } from '../../models/models';
import { MentorsService } from './mentors.service';

const STUDENTS_COLLECTION_NAME = 'students';

interface QueryStudentsParams {
  mentorId?: string;
  periodId?: string;
}

@Injectable({ providedIn: 'root' })
export class StudentsService {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly perf: AngularFirePerformance,
    private readonly periodsService: AcademicPeriodsService,
    private readonly mentorsService: MentorsService
  ) { }

  public getStudentsCollection(studentsParams?: QueryStudentsParams): AngularFirestoreCollection<Student> {
    return this.angularFirestore.collection<Student>(
      STUDENTS_COLLECTION_NAME,
      query => {
        // Oder students by name
        let q = query.orderBy('displayName');

        // filter students by mentor
        if (studentsParams && studentsParams.periodId) {
          const { ref } = this.periodsService.periodDocument(studentsParams.periodId);
          q = q.where('period.reference', '==', ref);
        }

        if (studentsParams && studentsParams.mentorId) {
          const { ref } = this.mentorsService.getMentorDocument(studentsParams.mentorId);
          q = q.where('mentor.reference', '==', ref);
        }

        return q;
      }
    );
  }

  public allStudents(studentsParams?: QueryStudentsParams): Observable<Students> {
    return this.getStudentsCollection(studentsParams)
      .valueChanges()
      .pipe(
        this.perf.trace('List mentor assigned students'),
        shareReplay(1)
      );
  }

}
