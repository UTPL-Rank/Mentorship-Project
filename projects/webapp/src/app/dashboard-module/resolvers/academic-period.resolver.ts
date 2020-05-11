import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AcademicPeriod } from '../../models/models';
import { AcademicPeriodService } from '../services/academic-period.service';

@Injectable({ providedIn: 'root' })
export class AcademicPeriodResolver implements Resolve<AcademicPeriod> {
  constructor(private period: AcademicPeriodService) { }

  // get the selected academic period,
  async resolve({ params }: ActivatedRouteSnapshot): Promise<AcademicPeriod> {
    if (!this.period.loaded)
      await this.period.loadAcademicPeriods();


    return this.period.academicPeriods.find(p => p.id === params.periodId);
  }
}
