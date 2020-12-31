import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMAccompaniment, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { MentorsService } from '../../../core/services/mentors.service';
import { StudentsService } from '../../../core/services/students.service';
import { UserService } from '../../../core/services/user.service';
import { ExportAccompanimentsCSVService } from '../../services/export-accompaniments-csv.service';
import { ListAccompanimentsQuery } from './list-accompaniments-query.interface';

@Component({
  selector: 'sgm-list-accompaniments',
  templateUrl: './list-accompaniments.component.html',
})
export class ListAccompanimentsComponent implements OnInit, OnDestroy {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    private readonly accompanimentsService: AccompanimentsService,
    public readonly auth: UserService,
    private readonly csv: ExportAccompanimentsCSVService,
  ) { }

  private exportSub: Subscription | null = null;

  private params: Observable<{ periodId: string }> = this.route.params as any;

  private query: Observable<ListAccompanimentsQuery> = this.route.queryParams;

  public readonly student$: Observable<SGMStudent.readDTO | null> = this.query.pipe(
    switchMap(({ studentId }) => !!studentId ? this.studentsService.student(studentId) : of(null)),
    shareReplay(1),
  );

  public readonly mentor$: Observable<SGMMentor.readDTO | null> = this.query.pipe(
    switchMap(({ mentorId, studentId }) => !!mentorId && !studentId ? this.mentorsService.mentorStream(mentorId) : of(null)),
    shareReplay(1),
  );

  public isPeriodActiveObs = this.route.data.pipe(
    map(d => (d.activePeriod as SGMAcademicPeriod.readDTO).current)
  );

  public readonly accompaniments$: Observable<Array<SGMAccompaniment.readDTO>> = combineLatest([this.query, this.params]).pipe(
    switchMap(([query, params]) =>
      this.accompanimentsService.accompanimentsStream({
        where: { periodId: params.periodId, mentorId: query.mentorId }, limit: 30, orderBy: { timeCreated: "desc" }
      })),
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

    if (!!this.exportSub)
      return;

    const exportFn = this.params.pipe(
      take(1),
      switchMap(params => this.csv.export$({ periodId: params.periodId }))
    );

    this.exportSub = exportFn.subscribe(completed => {
      if (!completed)
        alert('Ocurrió un error al exportar los estudiantes');

      this.exportSub?.unsubscribe();
      this.exportSub = null;
    });
  }
}
