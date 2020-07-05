import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mentor, MentorEvaluationActivities, MentorEvaluationDependencies, MentorEvaluationObservations } from '../../../models/models';

@Component({
  selector: 'sgm-mentor-report',
  templateUrl: './mentor-report.component.html',
  styleUrls: ['./mentor-report.component.scss']
})

export class MentorReportComponent implements OnInit {


  public signature: string;
  constructor(private readonly route: ActivatedRoute) { }


  mentor: Mentor;
  evaluationActivities: MentorEvaluationActivities;
  evaluationDependencies: MentorEvaluationDependencies;
  evaluationObservations: MentorEvaluationObservations;

  ngOnInit() {
    const { data, queryParams } = this.route.snapshot;
    this.mentor = data.mentor;
    this.evaluationActivities = data.evaluationActivities;
    this.evaluationDependencies = data.evaluationDependencies;
    this.evaluationObservations = data.evaluationObservations;

    this.signature = queryParams.signature;
  }
}
