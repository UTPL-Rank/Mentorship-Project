import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IsStudentGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  canActivate({ params }: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {
    return this.afAuth.idTokenResult.pipe(
      map(token => {
        // User hasn't sign in
        if (!token)
          return this.router.createUrlTree(['/ingresar'], { queryParams: { redirect: url } });

        // User is admin, and can enter the route
        // User is a student and is the correct student one
        if (token.claims.isAdmin || token.claims.isMentor && token.claims.studentId === params.studentId)
          return true;

        // Nop, user is not allowed to enter the route
        alert('No tienes permisos para ingresar a esta ruta');
        return false;
      })
    );
  }
}
