import { Component, Input } from '@angular/core';
import { Mentor } from '../../../models/models';

@Component({
  selector: 'sgm-mentor-stats',
  templateUrl: './mentor-stats.component.html'
})
export class MentorStatsComponent {

  mentor: Mentor;

  @Input('mentor')
  set mentorData(mentor: Mentor) {
    this.mentor = mentor;
  }
}
