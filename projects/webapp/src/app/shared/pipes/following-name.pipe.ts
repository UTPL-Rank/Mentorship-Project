import { Pipe, PipeTransform } from '@angular/core';
import { FollowingKind } from '../../models/accompaniment.model';

@Pipe({
  name: 'followingName'
})
export class FollowingNamePipe implements PipeTransform {
  transform(value: FollowingKind): string {
    if (value === 'sgm#presencial') {
      return 'Reuniones';
    }
    if (value === 'sgm#virtual') {
      return 'Medios informales';
    }
  }
}
