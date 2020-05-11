import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class IsAdminGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  async canActivate(_: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {
    const { currentUser } = this.afAuth.auth;

    // Navigate to redirect page, if user isn't signed in yet
    if (!currentUser) {
      return this.router.navigate(['/redirigir'], {
        queryParams: { redirect: url }
      });
    }

    // get custom claims and validate if user has admin role
    const { claims } = await currentUser.getIdTokenResult();
    if (!claims.isAdmin) {
      alert('No tienes permisos para ingresar a esta ruta');
      return false;
    }

    return true;
  }
}
