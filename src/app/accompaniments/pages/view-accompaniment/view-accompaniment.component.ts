import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { Observable, of, Subscription } from 'rxjs';
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

  public accompanimentObs: Observable<SGMAccompaniment.readDTO | null> = this.route.params.pipe(
    switchMap(params => this.accompanimentsService.accompanimentStream(params.accompanimentId)),
    shareReplay(1),
  );

  public readonly showOptions$: Observable<boolean> = this.user.isAdmin;

  public readonly importantSwitchText$: Observable<string> = this.accompanimentObs.pipe(
    map(acc => !!acc?.important ? 'Marcar como NO Importante' : 'Marcar como Importante'),
  );
  public readonly readSwitchText$: Observable<string> = this.accompanimentObs.pipe(
    map(acc => !!acc?.read ? 'Marcar como No leido' : 'Marcar como leido'),
  );

  //%20
  mailto$ = this.accompanimentObs.pipe(
    map(a => `mailto:${a?.mentor.email}?Subject=Acompañamiento%20Importante&body=Hola,%20${a?.mentor.displayName.toUpperCase()}%20queremos preguntar como esta el esto del problema: "${a?.problemDescription}"
    `)
  );

  private updatingSubscription: Subscription | null = null;

  public changeImportant(): void {
    if (!!this.updatingSubscription)
      return;

    const updateTask = this.accompanimentObs.pipe(
      take(1),
      switchMap(acc => !!acc ? this.accompanimentsService.changeImportant$(acc.id, !acc.important) : of(false)),
    );

    this.updatingSubscription = updateTask.subscribe(updated => {
      const message = updated ? 'Se actualizo correctamente' : 'Ocurrió un error, vuelve a intentarlo';
      alert(message);
      this.updatingSubscription?.unsubscribe();
      this.updatingSubscription = null;
    });
  }

  public changeRead(): void {
    if (!!this.updatingSubscription)
      return;

    const updateTask = this.accompanimentObs.pipe(
      take(1),
      switchMap(acc => !!acc ? this.accompanimentsService.changeRead$(acc.id, !acc.read) : of(false)),
    );

    this.updatingSubscription = updateTask.subscribe(updated => {
      const message = updated ? 'Se actualizo correctamente' : 'Ocurrió un error, vuelve a intentarlo';
      alert(message);
      this.updatingSubscription?.unsubscribe();
      this.updatingSubscription = null;
    });
  }

  get disableButton(): boolean {
    return !!this.updatingSubscription?.closed;
  }

}
