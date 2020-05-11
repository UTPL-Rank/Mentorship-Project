import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class IsMentorGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  async canActivate(
    { params }: ActivatedRouteSnapshot,
    { url }: RouterStateSnapshot
  ) {
    const { currentUser } = this.afAuth.auth;
    const { mentorId } = params;

    // Navigate to redirect page, if user isn't signed in yet
    if (!currentUser) {
      return this.router.navigate(['/redirigir'], {
        queryParams: { redirect: url }
      });
    }

    // get custom claims and validate if user has admin role
    const { claims } = await currentUser.getIdTokenResult();

    if (claims.isAdmin) {
      return true;
    }

    if (claims.isMentor && claims.mentorId === mentorId) {
      return true;
    }

    alert('No tienes permisos para ingresar a esta ruta');
    return false;
  }
}
