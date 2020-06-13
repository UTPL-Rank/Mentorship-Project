import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { AcademicPeriodsService } from '../../core/services/academic-period.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { MentorsService } from '../../core/services/mentors.service';
import { StudentsService } from '../../core/services/students.service';

@Injectable({ providedIn: 'root' })
export class StudentOfMentorGuard implements CanActivate {
  constructor(
    private readonly auth: AuthenticationService,
    private readonly periodsService: AcademicPeriodsService,
    private readonly studentsService: StudentsService,
    private readonly mentorsService: MentorsService,
  ) { }

  canActivate({ params }: ActivatedRouteSnapshot) {

    return this.auth.claims
      .pipe(
        mergeMap(async ({ isAdmin = false, mentorId, isMentor }) => {
          // User is admin, and can enter the route
          if (isAdmin) return true;

          if (!isMentor) return false;

          const periodRef = this.periodsService.periodDocument(params.periodId).ref;
          const mentorRef = this.mentorsService.getMentorDocument(mentorId).ref;

          const studentRef = this.studentsService
            .getStudentsCollection()
            .ref
            .where('id', '==', params.studentId)
            .where('period.reference', '==', periodRef)
            .where('mentor.reference', '==', mentorRef);

          const studentSnap = await studentRef.get();

          return !studentSnap.empty;
        })
      );
  }
}
