import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/acompaniments.service';
import { MentorsService } from '../../../core/services/mentors.service';
import { TitleService } from '../../../core/services/title.service';
import { FirestoreAccompaniments, Mentor } from '../../../models/models';

@Component({
  selector: 'sgm-view-mentor-history',
  templateUrl: 'view-mentor-history.component.html'
})

export class ViewMentorHistoryComponent {

  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
    private readonly accompanimentsService: AccompanimentsService,
  ) { }

  public readonly mentorObs: Observable<Mentor> = this.route.params
    .pipe(
      switchMap(params => this.mentorsService.getMentorAndShare(params.mentorId)),
      tap(mentor => this.title.setTitle(`Historial | ${mentor.displayName.toUpperCase()}`)),
    );

  public readonly accompanimentsObs: Observable<FirestoreAccompaniments> = this.route.params
    .pipe(switchMap(p => this.accompanimentsService.getAccompanimentsAndShare(p as any, 10)));

}
