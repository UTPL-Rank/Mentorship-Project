import { Pipe, PipeTransform } from '@angular/core';
import { SGMStudent } from '@utpl-rank/sgm-helpers';

@Pipe({
  name: 'academicCycleName'
})
export class AcademicCycleNamePipe implements PipeTransform {
  transform(value: SGMStudent.AcademicCycle): string {
    return SGMStudent.translateCycle(value);
  }
}
