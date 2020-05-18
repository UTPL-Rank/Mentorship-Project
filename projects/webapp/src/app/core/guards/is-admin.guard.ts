import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IsAdminGuard implements CanActivate {

  constructor(private readonly afAuth: AngularFireAuth, private readonly router: Router) { }

  canActivate(_: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {

    return this.afAuth.idTokenResult.pipe(
      map(idTokenResult => {
        // User hasn't sign in
        if (!idTokenResult)
          return this.router.createUrlTree(['/ingresar'], { queryParams: { redirect: url } });

        // yep, user is an admin
        if (idTokenResult.claims.isAdmin)
          return true;

        // user is not allowed to enter the route
        alert('No tienes permisos para ingresar a esta ruta, por favor vuelve a recargar la pagina.');
        return false;
      })
    );
  }
}
