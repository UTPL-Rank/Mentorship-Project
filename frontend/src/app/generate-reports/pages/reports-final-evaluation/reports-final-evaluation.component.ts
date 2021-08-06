import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'sgm-reports-final-evaluation',
  templateUrl: './reports-final-evaluation.component.html',
  styles: [
  ]
})
export class ReportsFinalEvaluationComponent implements OnInit {

  public TITLE_COVER = 'EVALUACIÓN FINAL DE MENTORÍA';
  public TYPE_COVER: string | undefined;

  public mentorId!: string;
  private paramsSubscription!: Subscription;

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.paramsSubscription = this.route.params.subscribe(
      async (params: Params) => {
        this.mentorId = params.mentorId;
      }
    );

  }

}
