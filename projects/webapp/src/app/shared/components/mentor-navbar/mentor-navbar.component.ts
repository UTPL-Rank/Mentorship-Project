import { Component, Input } from '@angular/core';
import { Mentor } from '../../../models/models';

@Component({
  selector: 'sgm-mentor-navbar',
  templateUrl: './mentor-navbar.component.html'
})

export class MentorNavbarComponent {

  public mentor: Mentor;

  @Input('mentor')
  set mentorData(m: Mentor) { this.mentor = m; }

}
