import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AcademicPeriodService } from '../services/academic-period.service';

/**
 * this guard is responsable por redirecting any user with the panel home, with the correct period id.
 */
@Injectable({ providedIn: 'root' })
export class RedirectToLastPeriodGuard implements CanActivate {
  constructor(private period: AcademicPeriodService, private router: Router) { }

  async canActivate() {
    // asume no period is defined
    // check if period have loaded
    if (!this.period.loaded) {
      await this.period.loadAcademicPeriods();
    }

    // just redirect to current period
    const active = this.period.academicPeriods.find(p => p.current);
    return this.router.navigate(['/panel-control', active.id]);
  }
}
