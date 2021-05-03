import { Pipe, PipeTransform } from "@angular/core";
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';

@Pipe({
  name: "semesterName"
})
export class SemesterNamePipe implements PipeTransform {
  transform(value: SGMAccompaniment.SemesterType): string {
    return SGMAccompaniment.translateSemester(value);
  }
}
