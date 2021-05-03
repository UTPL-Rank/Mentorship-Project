import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SGMStudent } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-students-header',
  templateUrl: './students-header.component.html'
})
export class StudentsHeaderComponent {

  constructor(
    public readonly location: Location,
  ) { }

  student!: SGMStudent.readDTO;

  @Input('student')
  set studentData(s: SGMStudent.readDTO) {
    this.student = s;
  }

  @Input()
  showCreateAccompaniment = false;
}
