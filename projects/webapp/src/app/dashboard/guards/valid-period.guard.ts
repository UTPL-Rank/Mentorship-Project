import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AcademicPeriodsService } from '../../core/services/academic-period.service';

/**
 * this guard is responsable por validating whether the academic period is valid, and loaded in the service
 */
@Injectable({ providedIn: 'root' })
export class ValidPeriodGuard implements CanActivate {
  constructor(private period: AcademicPeriodsService, private router: Router) { }

  async canActivate({ params }: ActivatedRouteSnapshot) {
    // check if period have loaded
    if (!this.period.hasLoaded)
      await this.period.loadAcademicPeriods();

    // get if periodId is valid
    const valid = this.period.loadedPeriods
      .map(p => p.id) // get only id's
      .includes(params.periodId); // search for a coincide

    if (!valid)
      // navigate to panel, to be redirected to a valid id
      return this.router.createUrlTree(['/panel-control']);

    return true;
  }
}
