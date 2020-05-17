import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IsSignInGuard implements CanActivate {

  constructor(private readonly afAuth: AngularFireAuth, private readonly router: Router) { }

  canActivate(_: ActivatedRouteSnapshot, { url: redirect }: RouterStateSnapshot) {
    return this.afAuth.user.pipe(
      map(user => user
        ? true
        : this.router.createUrlTree(['/panel-control/ingresar'], { queryParams: { redirect } })
      )
    );
  }
}
