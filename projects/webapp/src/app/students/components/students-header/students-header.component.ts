import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Student } from '../../../models/models';

@Component({
  selector: 'sgm-students-header',
  templateUrl: './students-header.component.html'
})
export class StudentsHeaderComponent {

  constructor(
    public readonly location: Location,
  ) { }

  student: Student;

  @Input('student')
  set studentData(s: Student) {
    this.student = s;
  }

  @Input()
  showCreateAccompaniment = false;
}
