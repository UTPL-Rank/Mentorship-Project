import { Component, Input, OnChanges } from "@angular/core";
import { SGMMentor } from "@utpl-rank/sgm-helpers";

@Component({
  selector: "sgm-generate-reports-mentors-table",
  templateUrl: "./generate-reports-mentors-table.component.html",
})
export class GenerateReportsMentorsTableComponent implements OnChanges {
  filteredMentors: any[] = [];
  @Input() filterString = "";
  @Input() filterType = "";
  public mentors!: SGMMentor.readDTO;

  @Input("mentors")
  set setMentorsData(mentors: SGMMentor.readDTO) {
    this.mentors = mentors;
  }

  @Input()
  public showArea = true;
  ngOnChanges() {
    this.filteredMentors = (this.mentors as any).filter((mentor: any) => {
      return mentor.displayName
        .toLowerCase()
        .includes(this.filterString.toLowerCase());
    });

    if (this.filterType !== "") {
      this.filteredMentors = (this.mentors as any).filter((mentor: any) => {
        if (this.filterType == "Nuevos") {
          if (mentor.firstYear) {
            
            return mentor;
          }
        } else {
          if (!mentor.firstYear) {
            
            return mentor;
          }
        }
      });
    }else{
      this.filteredMentors = (this.mentors as any).filter((mentor: any) => {
        return mentor.displayName
          .toLowerCase()
          .includes(this.filterString.toLowerCase());
      });

    }
  }
}
