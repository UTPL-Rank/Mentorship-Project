import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAccompaniment, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-accompaniments-report',
  templateUrl: './accompaniments-report.page.html'
})
export class AccompanimentsReportComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
    console.log('remove component');
  }

  public accompaniments!: SGMAccompaniment.readDTO[];
  public student!: SGMStudent.readDTO;
  public mentor!: SGMMentor.readDTO;
  public semesterKind!: SGMAccompaniment.SemesterType;

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
