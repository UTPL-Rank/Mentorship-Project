import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { MentorsService } from '../../core/services/mentors.service';
import { MentorEvaluationObservations } from '../../models/models';



@Injectable({ providedIn: 'root' })
export class PreloadEvaluationObservationsResolver implements Resolve<MentorEvaluationObservations> {

  constructor(private readonly mentorsService: MentorsService) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<MentorEvaluationObservations> {
    return this.mentorsService.evaluationObservations(params.mentorId);
  }
}
