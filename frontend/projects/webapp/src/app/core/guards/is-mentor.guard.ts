import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class IsMentorGuard implements CanActivate {
  constructor(
    private readonly auth: AuthenticationService,
    private readonly router: Router
  ) { }

  canActivate({ params }: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {

    const validateUserIsAdmin = this.auth.claims.pipe(
      map(claims => {
        // User hasn't sign in
        if (!claims)
          return this.router.createUrlTree(['/ingresar'], { queryParams: { redirect: url } });

        // User is admin, and can enter the route
        // User is a mentor and is the mentor is the correct one
        if (claims.isAdmin || claims.isMentor && claims.mentorId === params.mentorId)
          return true;

        // Nop, user is not allowed to enter the route
        alert('No tienes permisos para ingresar a esta ruta, por favor vuelve a recargar la pagina.');
        return false;
      })
    );

    return validateUserIsAdmin;
  }
}
