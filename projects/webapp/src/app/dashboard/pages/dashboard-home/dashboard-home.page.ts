import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/app';
import { iif, Observable, of } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { TitleService } from '../../../core/services/title.service';
import { UserService } from '../../../core/services/user.service';
import { Accompaniment } from '../../../models/models';

@Component({
  selector: 'sgm-dashboard-home',
  templateUrl: './dashboard-home.page.html'
})
export class DashboardHomePage implements OnInit {
  constructor(
    private readonly auth: UserService,
    private readonly title: TitleService,
    private readonly accompanimentsService: AccompanimentsService,
  ) { }

  user: Observable<User> = this.auth.currentUser;

  public importantAccompaniments$: Observable<Accompaniment[] | null> = this.auth.isAdmin.pipe(
    mergeMap(isAdmin => iif(() => isAdmin, this.accompanimentsService.importantAccompaniments$, of(null))),
    shareReplay(1),
  );

  public recentAccompaniments$: Observable<Accompaniment[] | null> = this.auth.claims.pipe(
    mergeMap(({ isMentor, mentorId }) => iif(() => isMentor, this.accompanimentsService.recentAccompaniments$(mentorId), of(null))),
    shareReplay(1),
  );

  public validateAccompaniments$: Observable<Accompaniment[] | null> = this.auth.claims.pipe(
    mergeMap(({ isStudent, studentId }) => iif(() => isStudent, this.accompanimentsService.validateAccompaniments$(studentId), of(null))),
    shareReplay(1),
  );

  async ngOnInit() {
    this.title.setTitle('Panel de Control');
  }
}
