import { Component, Input } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Student } from '../../../models/models';

@Component({
  selector: 'sgm-students-navbar',
  templateUrl: './students-navbar.component.html'
})
export class StudentsNavbarComponent {

  constructor(public readonly user: UserService) { }

  student: Student;

  @Input('student')
  set studentData(s: Student) {
    this.student = s;
  }
}
