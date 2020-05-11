import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcademicPeriod, Students } from '../../../models/models';

@Component({
  selector: 'sgm-students-table',
  templateUrl: './students-table.component.html'
})
export class StudentsTableComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  public students: Students;

  public academicPeriod: Observable<AcademicPeriod>;

  @Input('students')
  set studentsData(students: Students) {
    this.students = students;
  }

  ngOnInit() {
    this.academicPeriod = this.route.data.pipe(
      map(data => data.activePeriod)
    );
  }
}
