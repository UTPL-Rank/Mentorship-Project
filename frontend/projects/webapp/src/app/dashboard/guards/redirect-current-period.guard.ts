import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AcademicPeriodsService } from '../../core/services/academic-period.service';

/**
 * Redirect to the current academic period
 */
@Injectable({ providedIn: 'root' })
export class RedirectCurrentGuard implements CanActivate {

  constructor(
    private readonly period: AcademicPeriodsService,
    private readonly router: Router
  ) { }

  async canActivate() {
    // asume no period is defined
    // check if period have loaded
    if (!this.period.hasLoaded) {
      await this.period.loadAcademicPeriods();
    }

    // just redirect to current period
    const active = this.period.loadedPeriods.find(p => p.current);
    return this.router.createUrlTree(['/panel-control', active.id]);
  }
}
