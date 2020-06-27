import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { MentorsService } from '../../core/services/mentors.service';
import { MentorEvaluationDependencies } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class PreloadEvaluationDependenciesResolver implements Resolve<MentorEvaluationDependencies> {

  constructor(private readonly mentorsService: MentorsService) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<MentorEvaluationDependencies> {
    return this.mentorsService.evaluationDependencies(params.mentorId);
  }
}
