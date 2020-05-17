import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IsMentorGuard implements CanActivate {
  constructor(private readonly afAuth: AngularFireAuth, private readonly router: Router) { }

  canActivate({ params }: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {
    return this.afAuth.idTokenResult.pipe(
      map(token => {
        // User hasn't sign in
        if (!token)
          return this.router.createUrlTree(['/ingresar'], { queryParams: { redirect: url } });

        // User is admin, and can enter the route
        // User is a mentor and is the mentor is the correct one
        if (token.claims.isAdmin || token.claims.isMentor && token.claims.mentorId === params.mentorId)
          return true;

        // Nop, user is not allowed to enter the route
        alert('No tienes permisos para ingresar a esta ruta');
        return false;
      })
    );
  }
}
