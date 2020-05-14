import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FirestoreAccompaniment, Mentor, SemesterKind, Student } from "../../../models/models";

@Component({
  selector: "sgm-accompaniments-registry",
  templateUrl: "./accompaniments-registry.page.html"
})
export class AccompanimentsRegistryPage implements OnInit {
  constructor(private route: ActivatedRoute) { }

  public accompaniments: FirestoreAccompaniment[];
  public student: Student;
  public mentor: Mentor;
  public semesterKind: SemesterKind;

  public signature: string;

  ngOnInit() {
    const {
      data: { accompaniments, mentor, student },
      queryParams: { signature },
      params: { semesterKind }
    } = this.route.snapshot;

    this.accompaniments = accompaniments;
    this.mentor = mentor;
    this.student = student;
    this.signature = signature;
    this.semesterKind = semesterKind;
  }

  get academicPeriod() {
    if (!!this.accompaniments && this.accompaniments.length > 0) {
      return this.accompaniments[0].period.name;
    }
    return "";
  }
}