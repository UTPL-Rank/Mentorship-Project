import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { TitleService } from '../../../core/services/title.service';
import { Mentor } from '../../../models/models';

@Component({
  selector: 'sgm-final-evaluation',
  templateUrl: './final-evaluation.component.html'
})

export class FinalEvaluationComponent implements OnInit {

  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
  ) { }

  public readonly mentorObs: Observable<Mentor> = this.route.params.pipe(
    switchMap(params => this.mentorsService.getMentorAndShare(params.mentorId)),
    tap(mentor => this.title.setTitle(mentor.displayName.toUpperCase())),
  );

  ngOnInit() {

  }
}
