import { Pipe, PipeTransform } from '@angular/core';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';

@Pipe({
  name: 'qualificationValue'
})
export class QualificationValuePipe implements PipeTransform {
  transform(value: SGMAccompaniment.QualificationType): string {
    return SGMAccompaniment.translateQualification(value);
  }
}
