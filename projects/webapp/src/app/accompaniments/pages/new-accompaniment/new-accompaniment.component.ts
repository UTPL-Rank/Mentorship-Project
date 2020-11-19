import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AcademicPeriod, Mentor, Student } from '../../../models/models';

@Component({
  selector: 'sgm-new-accompaniment',
  templateUrl: './new-accompaniment.component.html'
})
export class NewAccompanimentComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
  ) { }

  public students: Student[];
  public mentor: Mentor;
  public period: AcademicPeriod;
  public selectedStudentId: string;

  ngOnInit() {
    const { students, mentor, activePeriod } = this.route.snapshot.data;
    const { selectedStudentId } = this.route.snapshot.queryParams;

    this.students = students;
    this.mentor = mentor;
    this.period = activePeriod;

    this.selectedStudentId = selectedStudentId;
  }
}
