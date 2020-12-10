import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { ReviewFormValue } from '../../../models/review-form.model';

@Component({
  selector: 'sgm-review-accompaniment',
  templateUrl: './review-accompaniment.component.html'
})
export class ReviewAccompanimentComponent {

  public readonly accompanimentObs: Observable<SGMAccompaniment.readDTO> = this.route.params.pipe(
    switchMap(params => this.accompanimentService.accompanimentStream(params.accompanimentId))
  );

  private isSaving = false;

  constructor(
    private readonly router: Router,
    private readonly accompanimentService: AccompanimentsService,
    private readonly route: ActivatedRoute,
  ) { }

  async save(confirmation: ReviewFormValue) {
    if (this.isSaving) return;

    // save on db
    try {
      this.isSaving = true;
      // TODO: validate confirmation
      const { accompanimentId } = this.route.snapshot.params;

      await this.accompanimentService.saveValidation(accompanimentId, confirmation);


      alert('Todos los cambios están guardados.\nGracias por colaborar.');
      this.router.navigateByUrl('/');
    } catch (error) {
      console.log(error);
      this.isSaving = false;
      alert('Ocurrió un error al guardar... Vuelve a intentarlo');
    }
  }
}
