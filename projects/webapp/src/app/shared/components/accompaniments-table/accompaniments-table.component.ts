import { Component, Input } from '@angular/core';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-accompaniments-table',
  templateUrl: './accompaniments-table.component.html'
})
export class AccompanimentsTableComponent {
  public accompaniments: Array<SGMAccompaniment.readDTO>;

  @Input('accompaniments')
  public set setAccompaniments(accompaniments: Array<SGMAccompaniment.readDTO>) {
    this.accompaniments = accompaniments;
  }

  @Input()
  public showMentorName = false;

  @Input()
  public showStudentName = false;

  @Input()
  public showValidate = false;
}
