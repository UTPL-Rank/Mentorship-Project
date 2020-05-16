import { Component, Input } from "@angular/core";
import { FirestoreAccompaniments } from "../../../models/models";

@Component({
  selector: "sgm-accompaniments-table",
  templateUrl: "./accompaniments-table.component.html"
})
export class AccompanimentsTableComponent {
  public accompaniments: FirestoreAccompaniments;

  @Input("accompaniments")
  set setAccompaniments(accompaniments: FirestoreAccompaniments) {
    this.accompaniments = accompaniments;
  }
}
