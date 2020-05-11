import { Component, Input } from '@angular/core';
import { Mentors } from '../../../models/models';

@Component({
  selector: 'sgm-mentors-table',
  templateUrl: './mentors-table.component.html'
})
export class MentorsTableComponent {
  public mentors: Mentors;

  @Input('mentors')
  set setMentorsData(mentors: Mentors) {
    this.mentors = mentors;
  }

  @Input()
  public showArea = true;
}
