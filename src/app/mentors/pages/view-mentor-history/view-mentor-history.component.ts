import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sgm-view-mentor-history',
  template: ''
})

export class ViewMentorHistoryComponent implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  async ngOnInit() {
    console.log('remove component');

    const params = this.route.snapshot.params;
    await this.router.navigate(['/panel-control', params.periodId, 'acompañamientos'], { queryParams: { mentorId: params.mentorId } });
  }

}
