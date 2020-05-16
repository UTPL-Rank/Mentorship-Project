import { Pipe, PipeTransform } from "@angular/core";
import { QualificationKind } from "../../models/accompaniment.model";

@Pipe({
  name: "qualificationValue"
})
export class QualificationValuePipe implements PipeTransform {
  transform(value: QualificationKind): string {
    if (value === "sgm#5") {
      return "5 - Excelente";
    }
    if (value === "sgm#4") {
      return "4 - Bueno";
    }
    if (value === "sgm#3") {
      return "3 - Regular";
    }
    if (value === "sgm#2") {
      return "2 - Malo";
    }
    if (value === "sgm#1") {
      return "1 - Muy Malo";
    }
  }
}
