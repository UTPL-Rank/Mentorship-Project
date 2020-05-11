import { Pipe, PipeTransform } from '@angular/core';
import { AcademicCycleKind } from '../../models/student.model';

@Pipe({
  name: 'academicCycleName'
})
export class AcademicCycleNamePipe implements PipeTransform {
  transform(value: AcademicCycleKind): string {
    if (value === 'sgm#first') {
      return 'Primer Ciclo';
    }
    if (value === 'sgm#second') {
      return 'Segundo Ciclo';
    }
    if (value === 'sgm#third') {
      return 'Tercero';
    }
  }
}
