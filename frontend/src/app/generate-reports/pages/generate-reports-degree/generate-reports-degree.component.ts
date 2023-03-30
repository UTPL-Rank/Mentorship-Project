import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params } from '@angular/router';
import { SGMAcademicArea, SGMAcademicDegree, SGMMentor } from '@utpl-rank/sgm-helpers';
import { Observable, Subscription } from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import { DegreesService } from '../../../core/services/degrees.service';
import { TitleService } from '../../../core/services/title.service';
import { UserService } from '../../../core/services/user.service';

// interface AreaStat {
//   id: SGMAcademicArea.AreaType;
//   name: string;
//   studentsCount: number;
//   accompanimentsCount: number;
//   mentors: Array<SGMMentor.readDTO>;
// }

@Component({
  selector: 'sgm-generate-reports-degree',
  templateUrl: './generate-reports-degree.component.html',
  styles: []
})
export class GenerateReportsDegreeComponent implements OnInit {

  degrees !: Array<SGMAcademicDegree.readDTO>;
  filterString = '';
  periodId = '';
  degreesSubscription !: Subscription;
  activePeriod: any;
  allDegrees: Observable<Array<SGMAcademicDegree.readDTO>> | any;
  

  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly degreesService: DegreesService,
    public readonly auth: UserService,

  ) {
  }

  ngOnInit() {
    
    this.title.setTitle('Estudiantes Mentores');
    this.activePeriod = this.route.snapshot.data;
  //   console.log(activePeriod);

  // console.log(activePeriod.date)
  // console.log(activePeriod.date.toDate())
  // console.log("boolean? = ", activePeriod.date.toDate() < new Date(1995, 11, 17))

  this.route.params.subscribe((params: Params) => {
      this.periodId = params.periodId;
    }
  );

this.allDegrees = this.degreesService.getAllDegrees(this.activePeriod);
  
}

// public allDegrees: Observable<Array<SGMAcademicDegree.readDTO>> =
//   this.degreesService.getAllDegrees();
    
    
    
    searchString(e: any) {
      this.filterString = e.target.value;
    }
    
}
