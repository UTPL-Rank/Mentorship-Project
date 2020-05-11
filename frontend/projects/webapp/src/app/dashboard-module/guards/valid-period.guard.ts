import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AcademicPeriodService } from '../services/academic-period.service';

/**
 * this guard is responsable por validating whether the academic period is valid, and loaded in the service
 */
@Injectable({ providedIn: 'root' })
export class ValidPeriodGuard implements CanActivate {
  constructor(private period: AcademicPeriodService, private router: Router) { }

  async canActivate({ params }: ActivatedRouteSnapshot) {
    // check if period have loaded
    if (!this.period.loaded)
      await this.period.loadAcademicPeriods();

    // get if periodId is valid
    const valid = this.period.academicPeriods
      .map(p => p.id) // get only id's
      .includes(params.periodId); // search for a coincide

    if (!valid)
      // navigate to panel, to be redirected to a valid id
      return this.router.navigateByUrl('/panel-control');

    return true;
  }
}
