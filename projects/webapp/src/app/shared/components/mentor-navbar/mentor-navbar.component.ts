import { Component, Input } from '@angular/core';
import { SGMMentor } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-mentor-navbar',
  templateUrl: './mentor-navbar.component.html'
})

export class MentorNavbarComponent {

  public mentor!: SGMMentor.readDTO;

  @Input('mentor')
  set mentorData(m: SGMMentor.readDTO) { this.mentor = m; }

}
