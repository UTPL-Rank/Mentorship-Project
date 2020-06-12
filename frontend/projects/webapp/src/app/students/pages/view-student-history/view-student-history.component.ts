import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/acompaniments.service';
import { StudentsService } from '../../../core/services/students.service';
import { TitleService } from '../../../core/services/title.service';
import { AcademicPeriod, FirestoreAccompaniments, Student } from '../../../models/models';

@Component({
  selector: 'sgm-view-student-history',
  templateUrl: 'view-student-history.component.html'
})

export class ViewStudentHistoryComponent {

  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly studentsService: StudentsService,
    private readonly accompanimentsService: AccompanimentsService,
  ) { }

  public readonly studentObs: Observable<Student> = this.route.params
    .pipe(
      switchMap(params => this.studentsService.getStudentObsAndShare(params.studentId)),
      tap(student => this.title.setTitle(`Historial | ${student.displayName.toUpperCase()}`)),
    );

  public readonly periodObs: Observable<AcademicPeriod> = this.route.data
    .pipe(map(d => d.activePeriod));


  public readonly accompanimentsObs: Observable<FirestoreAccompaniments> = this.route.params
    .pipe(
      switchMap(params => this.accompanimentsService.getAccompanimentsOfStudent(params.periodId, params.studentId)),
      shareReplay(1),
      map(a => [...a])
    );

  public readonly validatedObs: Observable<FirestoreAccompaniments> = this.accompanimentsObs
    .pipe(map(accompaniments => accompaniments.filter(a => !a.reviewKey)));

  public readonly unValidatedObs: Observable<FirestoreAccompaniments> = this.accompanimentsObs
    .pipe(map(accompaniments => accompaniments.filter(a => a.reviewKey)));
}
