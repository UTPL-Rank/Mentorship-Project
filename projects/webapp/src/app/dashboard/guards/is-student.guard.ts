import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserClaims } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class IsStudentGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  async canActivate(
    { params }: ActivatedRouteSnapshot,
    { url }: RouterStateSnapshot
  ) {
    const { currentUser } = this.afAuth.auth;
    const { studentId } = params;

    // Navigate to redirect page, if user isn't signed in yet
    if (!currentUser) {
      return this.router.navigate(['/redirigir'], {
        queryParams: { redirect: url }
      });
    }

    // get custom claims and validate if user has admin role
    const claims = (await currentUser.getIdTokenResult()).claims as UserClaims;
    if (claims.isAdmin) {
      return true;
    }

    if (claims.isStudent && claims.studentId === studentId) {
      return true;
    }

    alert('No tienes permisos para ingresar a esta ruta');
    return false;
  }
}
