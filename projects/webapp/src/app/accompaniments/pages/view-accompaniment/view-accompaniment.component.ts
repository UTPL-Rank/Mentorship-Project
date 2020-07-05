import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { FirestoreAccompaniment } from '../../../models/models';

@Component({
  selector: 'sgm-view-accompaniment',
  templateUrl: './view-accompaniment.component.html'
})
export class ViewAccompanimentComponent implements OnInit, OnDestroy {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly accompaniments: AccompanimentsService,
  ) { }

  public accompaniment: FirestoreAccompaniment;
  private sub: Subscription;

  ngOnInit() {
    const accompanimentObs: Observable<FirestoreAccompaniment> = this.route.params.pipe(
      switchMap(params => this.accompaniments.accompanimentStream(params.accompanimentId))
    );

    this.sub = accompanimentObs.subscribe(a => this.accompaniment = a);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
