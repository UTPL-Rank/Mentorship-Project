import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';

/**
 * Validate the user is signed in
 */
@Injectable({ providedIn: 'root' })
export class SignedInGuard implements CanActivate {

  constructor(
    private readonly auth: UserService,
    private readonly router: Router
  ) { }

  canActivate(_: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {
    return this.auth.currentUser
      .pipe(
        map(user => user ? true : this.router.createUrlTree(['/panel-control/ingresar'], { queryParams: { redirect: url } }))
      );
  }
}
