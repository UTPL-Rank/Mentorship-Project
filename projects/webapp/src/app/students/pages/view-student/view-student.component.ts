import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { StudentsService } from '../../../core/services/students.service';
import { TitleService } from '../../../core/services/title.service';
import { AcademicPeriod, FirestoreAccompaniments, Student } from '../../../models/models';

@Component({
  selector: 'sgm-view-student',
  templateUrl: './view-student.component.html'
})
export class ViewStudentComponent {

  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly studentsService: StudentsService,
    private readonly accompanimentsService: AccompanimentsService,
  ) { }

  public readonly period: Observable<AcademicPeriod> = this.route.data
    .pipe(map(d => d.activePeriod));

  public readonly studentObs: Observable<Student> = this.route.params
    .pipe(
      switchMap(params => this.studentsService.studentStream(params.studentId)),
      tap(student => this.title.setTitle(`Estudiante ${student.displayName.toUpperCase()}`)),
    );

  public readonly periodObs: Observable<AcademicPeriod> = this.route.data
    .pipe(map(d => d.activePeriod));


  public readonly accompanimentsObs: Observable<FirestoreAccompaniments> = this.route.params
    .pipe(
      switchMap(({ periodId, studentId }) => this.accompanimentsService.accompanimentsStream({ where: { periodId, studentId } })),
      shareReplay(1),
      map(a => [...a])
    );

  public readonly validatedObs: Observable<FirestoreAccompaniments> = this.accompanimentsObs
    .pipe(map(accompaniments => accompaniments.filter(a => !a.reviewKey)));

  public readonly unValidatedObs: Observable<FirestoreAccompaniments> = this.accompanimentsObs
    .pipe(map(accompaniments => accompaniments.filter(a => a.reviewKey)));

}
