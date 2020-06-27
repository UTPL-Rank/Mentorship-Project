import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sgm-mentor-report',
  templateUrl: './mentor-report.component.html'
})

export class MentorReportComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.snapshot.data);
  }
}
