import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable({ providedIn: 'root' })
export class IsStudentGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate({ params }: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {
    return this.auth.claims.pipe(
      map(claims => {
        // User hasn't sign in
        if (!claims)
          return this.router.createUrlTree(['/ingresar'], { queryParams: { redirect: url } });

        // User is admin, and can enter the route
        // User is a student and is the correct student one
        if (claims.isAdmin || (claims.isStudent && claims.studentId === params.studentId))
          return true;

        // Nop, user is not allowed to enter the route
        alert('No tienes permisos para ingresar a esta ruta, por favor vuelve a recargar la pagina.');
        return false;
      })
    );
  }
}
