import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreAccompaniment } from '../../../models/models';

@Component({
  selector: 'sgm-view-accompaniment',
  templateUrl: './view-accompaniment.page.html'
})
export class ViewAccompanimentPage implements OnInit, OnDestroy {
  constructor(private readonly route: ActivatedRoute) { }

  public accompaniment: FirestoreAccompaniment;
  private dataSub: Subscription;

  ngOnInit() {
    this.dataSub = this.route.data.subscribe(
      ({ accompaniment }) => (this.accompaniment = accompaniment)
    );
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }
}
