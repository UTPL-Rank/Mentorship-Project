import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AcademicAreasService } from '../../../core/services/academic-areas.service';
import { SGMAcademicArea } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-reports-area',
  templateUrl: './reports-area.component.html',
  styles: [
  ]
})
export class ReportsAreaComponent implements OnInit {

  public TITLE_COVER = 'FICHAS DE ACOMPAÑAMIENTO MENTORIAL';
  public TYPE_COVER: string | undefined;

  public periodId!: string;
  public areaId!: string;
  public area!: SGMAcademicArea.readDTO;

  private paramsSubscription!: Subscription;
  private academicAreasSubscription!: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly academicAreasService: AcademicAreasService
  ) { }

  ngOnInit(): void {

    this.paramsSubscription = this.route.params.subscribe(
      async (params: Params) => {
        this.periodId = params.periodId;
        this.areaId = params.areaId;
      }
    );

    this.academicAreasSubscription = this.academicAreasService.areaStream(this.areaId).subscribe(
      area => {
        if (area) {
          this.area = area;
          this.TYPE_COVER = this.area.name;
        }
      }
    );

  }

}
