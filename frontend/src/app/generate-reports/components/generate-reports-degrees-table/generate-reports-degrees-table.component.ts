import { Component, OnInit,Input } from '@angular/core';
import { SGMAcademicDegree, SGMMentor } from "@utpl-rank/sgm-helpers";

@Component({
  selector: 'sgm-generate-reports-degrees-table',
  templateUrl: './generate-reports-degrees-table.component.html',
  styles: [
  ]
})
export class GenerateReportsDegreesTableComponent implements OnInit {
  filteredDegrees: any[] = [];
  @Input() filterString = "";
  public degrees!: SGMAcademicDegree.readDTO;

  @Input("degrees")
  set setDegreesData(degrees: SGMAcademicDegree.readDTO) {
    this.degrees = degrees;
    console.log(degrees);
    console.log(this.degrees);
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
  ngOnInit(): void {
  }

}
