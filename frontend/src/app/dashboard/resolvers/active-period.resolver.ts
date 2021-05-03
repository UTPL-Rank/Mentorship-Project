import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SGMAcademicPeriod } from '@utpl-rank/sgm-helpers';
import { AcademicPeriodsService } from '../../core/services/academic-periods.service';

/**
 * Load the active academic period
 */
@Injectable({ providedIn: 'root' })
export class ActivePeriodResolver implements Resolve<SGMAcademicPeriod.readDTO> {

  constructor(private readonly period: AcademicPeriodsService) { }

  // get the selected academic period,
  async resolve({ params }: ActivatedRouteSnapshot): Promise<SGMAcademicPeriod.readDTO> {
    if (!this.period.hasLoaded)
      await this.period.loadAcademicPeriods();

    const founded = this.period.loadedPeriods.find(p => p.id === params.periodId);
    if (founded)
      return founded;

    throw new Error('Error locating period');
  }
}
