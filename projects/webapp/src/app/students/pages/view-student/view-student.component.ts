import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { StudentsService } from '../../../core/services/students.service';
import { TitleService } from '../../../core/services/title.service';
import { AcademicPeriod, Student } from '../../../models/models';

@Component({
  selector: 'sgm-view-student',
  templateUrl: './view-student.component.html'
})
export class ViewStudentComponent {

  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly studentsService: StudentsService,
  ) { }

  public readonly studentObs: Observable<Student | undefined> = this.route.params
    .pipe(
      switchMap(params => this.studentsService.getStudentObsAndShare(params.studentId)),
      tap(student => this.title.setTitle(student.displayName.toUpperCase())),
    );

  public readonly period: Observable<AcademicPeriod> = this.route.data
    .pipe(map(d => d.activePeriod));

}
