import {Component, Input} from '@angular/core';
import { SGMAccompaniment, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';

import { ScriptService } from '../../services/script.service';
import { StudentReport } from '../../../shared/reports/student/student-report';
import { MentorsService } from '../../../core/services/mentors.service';

declare let pdfMake: any;
declare let htmlToPdfmake: any;

@Component({
  selector: 'sgm-generate-reports-students-table',
  templateUrl: './generate-reports-students-table.component.html',
  styles: [
  ]
})
export class GenerateReportsStudentsTableComponent {

  constructor(
    private scriptService: ScriptService,
    private mentorsService: MentorsService
  ) {
    this.scriptService.load('pdfMake', 'vfsFonts', 'htmlToPdfmake');
  }

  public accompaniments!: SGMAccompaniment.readDTO[] | null;
  public student!: SGMStudent.readDTO | null;
  public mentor!: SGMMentor.readDTO | null;
  public semesterKind!: SGMAccompaniment.SemesterType | null;

  public signature: string | undefined | null;

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

  generatePDF(periodId: string, mentorId: string, studentId: string): void {

    this.accompaniments = null;
    this.mentorsService.mentorStream(mentorId).subscribe(value => this.mentor = value);
    this.student = null;
    this.signature = null;
    this.semesterKind = null;

    // get the file data and sent to report

    const html = new StudentReport({
      accompaniments: this.accompaniments,
      student: this.student,
      mentor: this.mentor,
      semesterKind: this.semesterKind,
      signature: this.signature}).html();

    const htmlFromPdfMake = htmlToPdfmake(html);
    const documentDefinition = { content: htmlFromPdfMake };
    pdfMake.createPdf(documentDefinition).open();
  }

}
