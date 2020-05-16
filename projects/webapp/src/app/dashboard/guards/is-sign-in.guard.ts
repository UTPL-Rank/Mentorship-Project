import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class IsSignInGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  async canActivate(_: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {
    const { currentUser } = this.afAuth.auth;

    // Navigate to redirect page, if user isn't signed in yet
    if (!currentUser) {
      return this.router.navigate(['/panel-control/redirigir'], {
        queryParams: { redirect: url }
      });
    }

    return true;
  }
}
