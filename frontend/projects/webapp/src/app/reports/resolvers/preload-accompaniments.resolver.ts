import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AccompanimentsService } from '../../core/services/accompaniments.service';
import { FirestoreAccompaniments } from '../../models/models';


@Injectable({ providedIn: 'root' })
export class PreloadAccompanimentsResolver implements Resolve<FirestoreAccompaniments> {

  constructor(private readonly accompanimentsService: AccompanimentsService) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<FirestoreAccompaniments> {
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
