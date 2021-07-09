import { Component, Input } from '@angular/core';
import {SGMAccompaniment, SGMMentor, SGMStudent} from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-report',
  templateUrl: './report.component.html',
  styles: [
  ]
})
export class ReportComponent {

  public semesterKind = 'sgm#secondSemester';

  public accompaniments!: Array<SGMAccompaniment.readDTO>;
  public student!: SGMStudent.readDTO;
  public mentor!: SGMMentor.readDTO;
  // public semesterKind!: SGMAccompaniment.SemesterType;
  public academicPeriod!: string;
  public signature!: string | undefined;

  @Input('accompaniments')
  public set setAccompaniments(accompaniments: Array<SGMAccompaniment.readDTO>) {
    this.accompaniments = accompaniments;
  }

  @Input('student')
  public set setStudent(student: SGMStudent.readDTO) {
    this.student = student;
  }

  @Input('mentor')
  public set setMentor(mentor: SGMMentor.readDTO) {
    this.mentor = mentor;
  }

  // @Input('semesterKind')
  // public set setSemesterKind(semesterKind: SGMAccompaniment.SemesterType) {
  //   this.semesterKind = semesterKind;
  // }

  @Input('academicPeriod')
  public set setAcademicPeriod(academicPeriod: string) {
    this.academicPeriod = academicPeriod;
  }

  @Input('signature')
  public set setSignature(signature: string) {
    this.signature = signature;
  }

}
