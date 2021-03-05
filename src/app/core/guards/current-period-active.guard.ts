import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AcademicPeriodsService } from '../services/academic-periods.service';

/**
 * Validate the active period is also the current period
 */
@Injectable({ providedIn: 'root' })
export class CurrentPeriodActiveGuard implements CanActivate {
  constructor(private readonly period: AcademicPeriodsService) { }

  async canActivate({ params }: ActivatedRouteSnapshot) {
    // check if periods have loaded
    if (!this.period.hasLoaded)
      await this.period.loadAcademicPeriods();

    // validate active period is current period
    return !!this.period.loadedPeriods.find(p => p.id === params.periodId)?.current;
  }
}
