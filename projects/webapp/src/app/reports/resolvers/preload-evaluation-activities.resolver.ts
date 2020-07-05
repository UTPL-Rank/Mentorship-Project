import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { MentorsService } from '../../core/services/mentors.service';
import { MentorEvaluationActivities } from '../../models/models';



@Injectable({ providedIn: 'root' })
export class PreloadEvaluationActivitiesResolver implements Resolve<MentorEvaluationActivities> {

  constructor(private readonly mentorsService: MentorsService) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<MentorEvaluationActivities> {
    return this.mentorsService.evaluationActivities(params.mentorId);
  }
}
