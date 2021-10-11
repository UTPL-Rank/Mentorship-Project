import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AcademicAreasService } from '../../../core/services/academic-areas.service';
import {SGMAcademicArea, SGMAcademicDegree} from '@utpl-rank/sgm-helpers';
import {DegreesService} from "../../../core/services/degrees.service";
import {take} from "rxjs/operators";

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
  public degreesOfArea!: Array<SGMAcademicDegree.readDTO>;

  private paramsSubscription!: Subscription;
  private academicAreasSubscription!: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly academicAreasService: AcademicAreasService,
    private readonly degreesService: DegreesService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(
      async (params: Params) => {
        this.periodId = params.periodId;
        this.areaId = params.areaId;
        this.area = await this.academicAreasService.areaStream(this.areaId).pipe(take(1)).toPromise().then();
        this.TYPE_COVER = this.area.name;
        this.degreesOfArea = await this.degreesService.getDegreesOfArea(this.area.id).pipe(take(1)).toPromise().then();
      }
    );

  }

}
