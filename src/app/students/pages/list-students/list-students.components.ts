import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { UserService } from '../../../core/services/user.service';
import { ExportStudentsCSVService } from '../../services/export-students-csv.service';
import { ListStudentsQuery } from './list-students-query.interface';

@Component({
  selector: 'sgm-list-students',
  templateUrl: './list-students.component.html'
})
export class ListStudentsComponent implements OnInit, OnDestroy {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    public readonly auth: UserService,
    private readonly csv: ExportStudentsCSVService,
  ) { }

  private exportSub: Subscription | null = null;

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

  get disabledButton() {
    return !!this.exportSub;
  }


  ngOnInit() {

  }

  ngOnDestroy() {
    this.exportSub?.unsubscribe();
  }

  public exportCSV() {

    if (!!this.exportSub) return;

    const exportTask = this.params.pipe(
      take(1),
      switchMap(params => this.csv.export$({ periodId: params.periodId }))
    );

    this.exportSub = exportTask.subscribe(completed => {
      if (!completed)
        alert('Ocurrió un error al exportar los estudiantes');

      this.exportSub?.unsubscribe();
      this.exportSub = null;
    });
  }
}
