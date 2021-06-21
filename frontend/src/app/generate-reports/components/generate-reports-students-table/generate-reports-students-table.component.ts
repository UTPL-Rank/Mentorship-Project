import { Component, Input, OnChanges } from "@angular/core";
import { SGMStudent } from "@utpl-rank/sgm-helpers";

@Component({
  selector: "sgm-generate-reports-students-table",
  templateUrl: "./generate-reports-students-table.component.html",
  styles: [],
})
export class GenerateReportsStudentsTableComponent implements OnChanges {
  @Input() filterString: string = "";
  public students!: Array<SGMStudent.readDTO>;
  public showMentorName = false;
  public filteredStudents: any = [];
  @Input("students")
  public set setStudents(students: Array<SGMStudent.readDTO>) {
    this.students = students;
  }

  @Input("showMentorName")
  public set _showMentorName(show: boolean) {
    this.showMentorName = show;
  }

  ngOnChanges() {
    if (this.filterString) {
      this.filteredStudents = this.students.filter((student) =>
        student.displayName.toLocaleLowerCase().includes(this.filterString.toLowerCase())
      );
      console.log(this.filteredStudents);
    }
  }
}