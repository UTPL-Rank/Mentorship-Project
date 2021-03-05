import { Component, Input } from '@angular/core';
import { SGMMentor } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-mentor-stats',
  templateUrl: './mentor-stats.component.html'
})
export class MentorStatsComponent {

  mentor!: SGMMentor.readDTO;

  @Input('mentor')
  set mentorData(mentor: SGMMentor.readDTO) {
    this.mentor = mentor;
  }
}
