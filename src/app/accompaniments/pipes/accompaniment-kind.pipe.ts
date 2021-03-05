import { Pipe, PipeTransform } from '@angular/core';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';

@Pipe({
  name: 'transformAccompanimentKind'
})
export class AccompanimentKindPipe implements PipeTransform {
  transform(value?: SGMAccompaniment.AccompanimentKind): any {
    return SGMAccompaniment.translateKind(value);
  }
}
