import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'sgm-reports-general',
  templateUrl: './reports-general.component.html',
  styles: [
  ]
})
export class ReportsGeneralComponent implements OnInit {

  public TITLE_COVER = 'FICHAS DE ACOMPAÑAMIENTO MENTORIAL';
  public TYPE_COVER: string | undefined;

  public periodId!: string;
  private paramsSubscription!: Subscription;

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.paramsSubscription = this.route.params.subscribe(
      async (params: Params) => {
        this.periodId = params.periodId;
      }
    );

  }

}
