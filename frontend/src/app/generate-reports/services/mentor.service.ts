import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMMentor, SGMStudent } from '@utpl-rank/sgm-helpers';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MentorService {

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  public mentor_data = this.route.data.pipe(
    map(d => ( d.mentorId ,d.activePeriod as SGMAcademicPeriod.readDTO).current)
  );
}
