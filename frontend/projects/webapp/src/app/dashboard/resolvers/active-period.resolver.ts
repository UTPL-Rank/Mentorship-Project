import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AcademicPeriodsService } from '../../core/services/academic-periods.service';
import { AcademicPeriod } from '../../models/models';

/**
 * Load the active academic period
 */
@Injectable({ providedIn: 'root' })
export class ActivePeriodResolver implements Resolve<AcademicPeriod> {

  constructor(private readonly period: AcademicPeriodsService) { }

  // get the selected academic period,
  async resolve({ params }: ActivatedRouteSnapshot): Promise<AcademicPeriod> {
    if (!this.period.hasLoaded)
      await this.period.loadAcademicPeriods();

    return this.period.loadedPeriods.find(p => p.id === params.periodId);
  }
}
