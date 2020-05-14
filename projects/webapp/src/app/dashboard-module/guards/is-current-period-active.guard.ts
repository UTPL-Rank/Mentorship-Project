import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AcademicPeriodsService } from '../../core/services/academic-period.service';

/**
 * this guard is responsable por validating access to route is only restricted to
 * the period with teh current attribute
 */
@Injectable({ providedIn: 'root' })
export class IsCurrentPeriodActiveGuard implements CanActivate {
  constructor(private period: AcademicPeriodsService) { }

  async canActivate({ params }: ActivatedRouteSnapshot) {
    // check if periods have loaded
    if (!this.period.hasLoaded) {
      await this.period.loadAcademicPeriods();
    }

    const period = this.period.loadedPeriods
      // get period with id
      .find(p => p.id === params.periodId);

    return period.current;
  }
}
