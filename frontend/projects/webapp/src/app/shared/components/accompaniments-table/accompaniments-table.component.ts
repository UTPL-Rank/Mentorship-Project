import { Component, Input } from '@angular/core';
import { FirestoreAccompaniments } from '../../../models/models';

@Component({
  selector: 'sgm-accompaniments-table',
  templateUrl: './accompaniments-table.component.html'
})
export class AccompanimentsTableComponent {
  public accompaniments: FirestoreAccompaniments;
  public showStudentName = false;

  @Input('showStudentName')
  set setDisplay(showStudentName: boolean) {
    this.showStudentName = showStudentName;
  }

  @Input('accompaniments')
  set setAccompaniments(accompaniments: FirestoreAccompaniments) {
    this.accompaniments = accompaniments;
  }
}
