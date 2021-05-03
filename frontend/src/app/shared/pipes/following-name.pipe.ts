import { Pipe, PipeTransform } from '@angular/core';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';

@Pipe({
  name: 'followingName'
})
export class FollowingNamePipe implements PipeTransform {
  transform(value: SGMAccompaniment.FollowingType): string {
    return SGMAccompaniment.translateFollowing(value);
  }
}
