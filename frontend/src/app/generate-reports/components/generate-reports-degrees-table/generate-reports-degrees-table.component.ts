import { Component, OnChanges, Input } from '@angular/core';
import { SGMAcademicDegree } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-generate-reports-degrees-table',
  templateUrl: './generate-reports-degrees-table.component.html',
  styles: [
  ]
})
export class GenerateReportsDegreesTableComponent implements OnChanges {
  public filteredDegrees: any[] = [];
  public degrees!: SGMAcademicDegree.readDTO;
  public periodId!: string;

  @Input() filterString = '';

  @Input('degrees')
  set setDegreesData(degrees: SGMAcademicDegree.readDTO) {
    this.degrees = degrees;
  }

  @Input('periodId')
  set setPeriodId(periodId: string) {
    this.periodId = periodId;
  }

  @Input()
  public showArea = true;

  ngOnChanges() {
    if (this.filterString) {
      this.filteredDegrees = (this.degrees as any).filter((degree: any) => {
        return degree.name
          .toLowerCase()
          .includes(this.filterString.toLowerCase());
      });
    }
  }

}
