import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { Mentor, Student } from '../../../models/models';

@Component({
  selector: 'sgm-accompaniments-report',
  templateUrl: './accompaniments-report.page.html'
})
export class AccompanimentsReportComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
    console.log('remove component');
  }

  public accompaniments: SGMAccompaniment.readDTO[] | undefined;
  public student: Student | undefined;
  public mentor: Mentor | undefined;
  public semesterKind: SGMAccompaniment.SemesterType | undefined;

  public signature: string | undefined;

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
    if (!!this.accompaniments && this.accompaniments.length > 0)
      return this.accompaniments[0].period.name;

    return '';
  }
}
