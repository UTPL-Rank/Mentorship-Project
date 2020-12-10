import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { Mentor, Student } from '../../../models/models';

@Component({
  selector: 'sgm-accompaniments-report',
  templateUrl: './accompaniments-report.page.html'
})
export class AccompanimentsReportComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  public accompaniments: SGMAccompaniment.readDTO[];
  public student: Student;
  public mentor: Mentor;
  public semesterKind: SGMAccompaniment.SemesterType;

  public signature: string;

  ngOnInit() {
    const {
      data: { accompaniments, mentor, student },
      queryParams: { signature },
      params: { semesterKind }
    } = this.route.snapshot;

    this.accompaniments = accompaniments;
    this.mentor = mentor;
    this.student = student;
    this.signature = signature;
    this.semesterKind = semesterKind;
  }

  get academicPeriod() {
    if (!!this.accompaniments && this.accompaniments.length > 0) {
      return this.accompaniments[0].period.name;
    }
    return '';
  }
}
