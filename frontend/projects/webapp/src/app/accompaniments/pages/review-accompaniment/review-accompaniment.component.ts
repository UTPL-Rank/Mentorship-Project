import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { Accompaniment } from '../../../models/models';
import { ReviewFormValue } from '../../../models/review-form.model';

@Component({
  selector: 'sgm-review-accompaniment',
  templateUrl: './review-accompaniment.component.html'
})
export class ReviewAccompanimentComponent implements OnInit, OnDestroy {
  constructor(
    private readonly router: Router,
    private readonly accompanimentService: AccompanimentsService,
    private readonly route: ActivatedRoute,
  ) { }

  public accompaniment: Accompaniment;
  private sub: Subscription;
  private isSaving = false;

  ngOnInit() {
    const accompanimentObs: Observable<Accompaniment> = this.route.params.pipe(
      switchMap(params => this.accompanimentService.accompanimentStream(params.accompanimentId))
    );

    this.sub = accompanimentObs.subscribe(a => this.accompaniment = a);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async save(confirmation: ReviewFormValue) {
    if (this.isSaving) return;

    // save on db
    try {
      this.isSaving = true;
      // TODO: validate confirmation

      await this.accompanimentService.saveValidation(this.accompaniment.id, confirmation)


      alert('Todos los cambios están guardados.\nGracias por colaborar.');
      this.router.navigateByUrl('/');
    } catch (error) {
      console.log(error);
      this.isSaving = false;
      alert('Ocurrió un error al guardar... Vuelve a intentarlo');
    }
  }
}
