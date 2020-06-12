import { Pipe, PipeTransform } from "@angular/core";
import { SemesterKind } from "../../models/accompaniment.model";

@Pipe({
  name: "semesterName"
})
export class SemesterNamePipe implements PipeTransform {
  transform(value: SemesterKind): string {
    if (value === "sgm#firstSemester") {
      return "Primer Bimestre";
    }
    if (value === "sgm#secondSemester") {
      return "Segundo Bimestre";
    }
  }
}
