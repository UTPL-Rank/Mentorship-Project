import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AcademicPeriod, Mentor } from '../../../models/models';

@Component({
  selector: 'sgm-mentor-header',
  templateUrl: './mentor-header.component.html'
})

export class MentorHeaderComponent {

  constructor(private readonly route: ActivatedRoute) { }

  public mentor: Mentor;

  @Input('mentor')
  set mentorData(m: Mentor) { this.mentor = m; }

  public isPeriodActiveObs = this.route.data.pipe(
    map(d => (d.activePeriod as AcademicPeriod).current)
  );
}
