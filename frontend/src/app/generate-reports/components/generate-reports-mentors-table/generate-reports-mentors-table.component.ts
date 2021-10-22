import { Component, Input, OnChanges } from '@angular/core';
import { SGMMentor } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-generate-reports-mentors-table',
  templateUrl: './generate-reports-mentors-table.component.html',
})
export class GenerateReportsMentorsTableComponent implements OnChanges {
  filteredMentors: any[] = [];
  @Input() filterString = '';
  public mentors!: SGMMentor.readDTO;

  @Input('mentors')
  set setMentorsData(mentors: SGMMentor.readDTO) {
    this.mentors = mentors;
  }

  @Input()
  public showArea = true;
  ngOnChanges() {
    if (this.filterString) {
      this.filteredMentors = (this.mentors as any).filter((mentor: any) => {
        return mentor.displayName
          .toLowerCase()
          .includes(this.filterString.toLowerCase());
      });
    }
  }
}
