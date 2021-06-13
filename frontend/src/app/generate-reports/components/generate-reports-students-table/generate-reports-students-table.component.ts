import {Component, Input} from '@angular/core';
import { SGMStudent } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-generate-reports-students-table',
  templateUrl: './generate-reports-students-table.component.html',
  styles: [
  ]
})
export class GenerateReportsStudentsTableComponent {

  public students!: Array<SGMStudent.readDTO>;
  public showMentorName = false;

  @Input('students')
  public set setStudents(students: Array<SGMStudent.readDTO>) {
    this.students = students;
  }

  @Input('showMentorName')
  public set _showMentorName(show: boolean) {
    this.showMentorName = show;
  }

}
