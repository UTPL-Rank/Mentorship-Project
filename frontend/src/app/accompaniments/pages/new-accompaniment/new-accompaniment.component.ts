import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-new-accompaniment',
  templateUrl: './new-accompaniment.component.html'
})
export class NewAccompanimentComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
  ) { }

  public students!: Array<SGMStudent.readDTO>;
  public mentor!: SGMMentor.readDTO;
  public period!: SGMAcademicPeriod.readDTO;
  public selectedStudentId!: string;

  ngOnInit() {
    const { students, mentor, activePeriod } = this.route.snapshot.data;
    const { selectedStudentId } = this.route.snapshot.queryParams;

    this.students = students;
    this.mentor = mentor;
    this.period = activePeriod;

    this.selectedStudentId = selectedStudentId;
  }
}
