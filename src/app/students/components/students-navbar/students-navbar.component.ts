import { Component, Input } from '@angular/core';
import { SGMStudent } from '@utpl-rank/sgm-helpers';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'sgm-students-navbar',
  templateUrl: './students-navbar.component.html'
})
export class StudentsNavbarComponent {

  constructor(public readonly user: UserService) { }

  student!: SGMStudent.readDTO;

  @Input('student')
  set studentData(s: SGMStudent.readDTO) {
    this.student = s;
  }
}
