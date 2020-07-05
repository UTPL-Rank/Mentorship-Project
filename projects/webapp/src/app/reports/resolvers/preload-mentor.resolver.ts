import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { MentorsService } from '../../core/services/mentors.service';
import { Mentor } from '../../models/mentor.model';

@Injectable({ providedIn: 'root' })
export class PreloadMentorResolver implements Resolve<Mentor> {

  constructor(private readonly mentorService: MentorsService) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<Mentor> {
    return this.mentorService.mentor(params.mentorId);
  }
}
