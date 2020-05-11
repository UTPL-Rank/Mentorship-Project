import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AcademicPeriodService } from '../services/academic-period.service';

/**
 * this guard is responsable por validating access to route is only restricted to
 * the period with teh current attribute
 */
@Injectable({ providedIn: 'root' })
export class IsCurrentPeriodActiveGuard implements CanActivate {
  constructor(private period: AcademicPeriodService) { }

  async canActivate({ params }: ActivatedRouteSnapshot) {
    // check if periods have loaded
    if (!this.period.loaded) {
      await this.period.loadAcademicPeriods();
    }

    const period = this.period.academicPeriods
      // get period with id
      .find(p => p.id === params.periodId);

    return period.current;
  }
}
