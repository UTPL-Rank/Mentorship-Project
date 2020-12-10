import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'sgm-view-accompaniment',
  templateUrl: './view-accompaniment.component.html'
})
export class ViewAccompanimentComponent {

  constructor(
    private readonly user: UserService,
    private readonly route: ActivatedRoute,
    private readonly accompanimentsService: AccompanimentsService,
    ) { }

  public accompanimentObs = this.route.params.pipe(
    switchMap(params => this.accompanimentsService.accompanimentStream(params.accompanimentId)),
    shareReplay(1),
  );

  public readonly showImportantSwitch$: Observable<boolean> = this.user.isAdmin;

  public readonly importantSwitchText$: Observable<string> = this.accompanimentObs.pipe(
    map(acc => !!acc.important ? 'Marcar como NO Importante' : 'Marcar como Importante'),
  );

  private changeImportantSub: Subscription | null = null;

  public changeImportant(): void {
    if (!!this.changeImportantSub)
      return;

    const updateTask = this.accompanimentObs.pipe(
      take(1),
      switchMap(acc => this.accompanimentsService.changeImportant$(acc.id, !acc.important)),
    );

    this.changeImportantSub = updateTask.subscribe(updated => {
      const message = updated ? 'Se actualizo correctamente' : 'Ocurrió un error, vuelve a intentarlo';
      alert(message);
      this.changeImportantSub?.unsubscribe();
      this.changeImportantSub = null;
    });
  }

  get disableButton(): boolean {
    return !!this.changeImportantSub?.closed;
  }
}
