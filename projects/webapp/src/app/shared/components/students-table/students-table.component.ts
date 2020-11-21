import { Component, Input } from '@angular/core';
import { Students } from '../../../models/models';

@Component({
  selector: 'sgm-students-table',
  templateUrl: './students-table.component.html'
})
export class StudentsTableComponent {
  public students: Students;
  public showMentorName = false;

  @Input('students')
  public set setStudents(students: Students) {
    this.students = students;
  }

  @Input('showMentorName')
  public set _showMentorName(show: boolean) {
    this.showMentorName = show;
  }
}
