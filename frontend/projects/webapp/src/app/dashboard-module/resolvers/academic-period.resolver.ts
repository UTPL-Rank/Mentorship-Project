import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AcademicPeriodsService } from '../../core/services/academic-period.service';
import { AcademicPeriod } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class AcademicPeriodResolver implements Resolve<AcademicPeriod> {
  constructor(private period: AcademicPeriodsService) { }

  // get the selected academic period,
  async resolve({ params }: ActivatedRouteSnapshot): Promise<AcademicPeriod> {
    if (!this.period.hasLoaded)
      await this.period.loadAcademicPeriods();


    return this.period.loadedPeriods.find(p => p.id === params.periodId);
  }
}
