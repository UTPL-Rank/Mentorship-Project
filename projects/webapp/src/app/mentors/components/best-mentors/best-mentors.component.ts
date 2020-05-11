import { Component, Input } from '@angular/core';
import { Mentors } from '../../../models/models';

@Component({
  selector: 'sgm-best-mentors',
  templateUrl: './best-mentors.component.html'
})

export class BestMentorsComponent {
  public mentors: Mentors;

  @Input('mentors')
  set setMentorsData(mentors: Mentors) {
    this.mentors = mentors;
  }
}
