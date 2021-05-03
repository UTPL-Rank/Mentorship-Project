import { Component, Input } from '@angular/core';
import { SGMMentor } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-mentors-table',
  templateUrl: './mentors-table.component.html'
})
export class MentorsTableComponent {
  public mentors!: SGMMentor.readDTO;

  @Input('mentors')
  set setMentorsData(mentors: SGMMentor.readDTO) {
    this.mentors = mentors;
  }

  @Input()
  public showArea = true;
}
