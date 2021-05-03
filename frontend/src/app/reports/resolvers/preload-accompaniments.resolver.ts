import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { AccompanimentsService } from '../../core/services/accompaniments.service';

@Injectable({ providedIn: 'root' })
export class PreloadAccompanimentsResolver implements Resolve<Array<SGMAccompaniment.readDTO>> {

  constructor(private readonly accompanimentsService: AccompanimentsService) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<Array<SGMAccompaniment.readDTO>> {
    return this.accompanimentsService.accompaniments(
      {
        orderBy:
          { timeCreated: 'asc' },
        where:
        {
          semesterKind: params.semesterKind,
          mentorId: params.mentorId,
          studentId: params.studentId,
        }
      }
    );
  }
}
