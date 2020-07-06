import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AccompanimentsService } from '../../core/services/accompaniments.service';

/**
 * Check if an accompaniment with the `periodId` and `accompanimentId` exists
 */
@Injectable({ providedIn: 'root' })
export class ValidAccompanimentGuard implements CanActivate {
  constructor(
    private readonly accompanimentService: AccompanimentsService,
  ) { }

  canActivate({ params }: ActivatedRouteSnapshot) {
    const { accompanimentId, periodId } = params;
    const query = { accompanimentId, where: { periodId } };
    return this.accompanimentService.accompanimentExists(query);
  }
}
