import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SGMMentor } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { MentorsService } from '../services/mentors.service';

@Injectable({ providedIn: 'root' })
export class PreloadMentorResolver implements Resolve<SGMMentor.readDTO> {

  constructor(private readonly mentorService: MentorsService) { }

  resolve({ params }: ActivatedRouteSnapshot): Observable<SGMMentor.readDTO> {
    return this.mentorService.mentor(params.mentorId);
  }
}
