import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { AcademicPeriodsService } from '../../core/services/academic-periods.service';

/**
 * this guard is responsable por validating whether the academic period is valid, and loaded in the service
 */
@Injectable({ providedIn: 'root' })
export class ValidPeriodGuard implements CanActivate {
  constructor(
    private period: AcademicPeriodsService,
    private router: Router,
    private user: UserService,
  ) { }

  async canActivate({ params }: ActivatedRouteSnapshot) {
    const periodId = params.periodId;

    // check if period have loaded
    if (!this.period.hasLoaded)
      await this.period.loadAcademicPeriods();

    // get if periodId is valid
    let valid = this.period.loadedPeriods
      .map(p => p.id) // get only id's
      .includes(periodId); // search for a coincide

    // validate access to older periods
    const claims = await this.user.claims.pipe(take(1)).toPromise();

    if (claims && !claims.isAdmin) {
      // validate the period id current period
      const coincidence = this.period.loadedPeriods.find(period => period.id === periodId);
      valid = !!coincidence?.current;
    }

    if (valid)
      return true;

    // navigate to panel, to be redirected to a valid id
    return this.router.createUrlTree(['/panel-control']);
  }
}
