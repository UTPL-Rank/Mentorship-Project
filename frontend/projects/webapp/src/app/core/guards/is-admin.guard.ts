import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

/**
 * Validate the current user has the admin claims
 */
@Injectable({ providedIn: 'root' })
export class IsAdminGuard implements CanActivate {

  constructor(
    private readonly auth: AuthenticationService,
    private readonly router: Router
  ) { }

  canActivate(_: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {
    return this.auth.claims.pipe(
      map(claims => {
        // User hasn't sign in
        if (!claims)
          return this.router.createUrlTree(['/ingresar'], { queryParams: { redirect: url } });

        // yep, user is an admin
        if (claims.isAdmin)
          return true;

        // user is not allowed to enter the route
        alert('No tienes permisos para ingresar a esta ruta, por favor vuelve a recargar la pagina.');
        return false;
      })
    );
  }

}
