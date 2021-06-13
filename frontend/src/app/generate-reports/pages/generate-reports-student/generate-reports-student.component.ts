import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { StudentsService } from '../../../core/services/students.service';
import { MentorsService } from '../../../core/services/mentors.service';
import { UserService } from '../../../core/services/user.service';

export interface ListStudentsQuery {
  mentorId?: string;
  page?: number;
  limit?: number;
}

@Component({
  selector: 'sgm-generate-reports-student',
  templateUrl: './generate-reports-student.component.html',
  styles: [
  ]
})
export class GenerateReportsStudentComponent implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    public readonly auth: UserService,
    ) {
  }
  private params: Observable<{ periodId: string }> = this.route.params as any;

  private query: Observable<ListStudentsQuery> = this.route.queryParams;

  public readonly mentor$: Observable<SGMMentor.readDTO | null> = this.query.pipe(
    switchMap(({ mentorId }) => !!mentorId ? this.mentorsService.mentorStream(mentorId) : of(null)),
    shareReplay(1),
  );

  public isPeriodActiveObs = this.route.data.pipe(
    map(d => (d.activePeriod as SGMAcademicPeriod.readDTO).current)
  );

  public readonly students$: Observable<Array<SGMStudent.readDTO>> = combineLatest([this.query, this.params]).pipe(
    switchMap(([query, params]) => this.studentsService.list$({ periodId: params.periodId, mentorId: query.mentorId, limit: 50 })),
    shareReplay(1),
  );

  public readonly showMentorName$: Observable<boolean> = this.mentor$.pipe(
    map(m => !m)
  );

  ngOnInit(): void {
  }

}
