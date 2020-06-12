import { Component, Input } from '@angular/core';
import { Student } from '../../../models/models';

@Component({
  selector: 'sgm-students-navbar',
  templateUrl: './students-navbar.component.html'
})
export class StudentsNavbarComponent {

  student: Student;

  @Input('student')
  set studentData(s: Student) {
    this.student = s;
  }
}
