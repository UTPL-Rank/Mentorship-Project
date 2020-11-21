import { Component, Input } from '@angular/core';
import { Accompaniment } from '../../../models/models';

@Component({
  selector: 'sgm-accompaniments-table',
  templateUrl: './accompaniments-table.component.html'
})
export class AccompanimentsTableComponent {
  public accompaniments: Accompaniment[];

  @Input('accompaniments')
  public set setAccompaniments(accompaniments: Accompaniment[]) {
    this.accompaniments = accompaniments;
  }

  @Input()
  public mentorName = false;

  @Input()
  public showStudentName = false;

  @Input()
  public showValidate = false;
}
