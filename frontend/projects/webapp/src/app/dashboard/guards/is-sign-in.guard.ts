import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable({ providedIn: 'root' })
export class IsSignInGuard implements CanActivate {

  constructor(private readonly auth: AuthenticationService, private readonly router: Router) { }

  canActivate(_: ActivatedRouteSnapshot, { url: redirect }: RouterStateSnapshot) {
    return this.auth.currentUser.pipe(
      map(user => user
        ? true
        : this.router.createUrlTree(['/panel-control/ingresar'], { queryParams: { redirect } })
      )
    );
  }
}
