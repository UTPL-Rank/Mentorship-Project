import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  public area_data = this.route.data.pipe(
    map(d => ( d.areaId as SGMAcademicPeriod.readDTO).current)
  );
}
