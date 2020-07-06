import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';

@Component({
  selector: 'sgm-view-accompaniment',
  templateUrl: './view-accompaniment.component.html'
})
export class ViewAccompanimentComponent {

  public accompanimentObs = this.route.params.pipe(
    switchMap(params => this.accompaniments.accompanimentStream(params.accompanimentId))
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly accompaniments: AccompanimentsService,
  ) { }
}
