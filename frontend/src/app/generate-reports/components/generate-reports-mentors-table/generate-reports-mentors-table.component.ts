import { Component, Input } from '@angular/core';
import { SGMMentor } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-generate-reports-mentors-table',
  templateUrl: './generate-reports-mentors-table.component.html'
})
export class GenerateReportsMentorsTableComponent {
  public mentors!: SGMMentor.readDTO;

  @Input('mentors')
  set setMentorsData(mentors: SGMMentor.readDTO) {
    this.mentors = mentors;
  }

  @Input()
  public showArea = true;
}
