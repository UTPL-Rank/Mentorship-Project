import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AcademicPeriodsService } from '../../core/services/academic-period.service';

/**
 * this guard is responsable por redirecting any user with the panel home, with the correct period id.
 */
@Injectable({ providedIn: 'root' })
export class RedirectToLastPeriodGuard implements CanActivate {
  constructor(private period: AcademicPeriodsService, private router: Router) { }

  async canActivate() {
    // asume no period is defined
    // check if period have loaded
    if (!this.period.hasLoaded) {
      await this.period.loadAcademicPeriods();
    }

    // just redirect to current period
    const active = this.period.loadedPeriods.find(p => p.current);
    return this.router.navigate(['/panel-control', active.id]);
  }
}
