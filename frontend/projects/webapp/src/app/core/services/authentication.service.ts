import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { UserClaims } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  public claims: Observable<UserClaims> = this.afAuth.user.pipe(
    filter(user => !!user),
    map(user => user.email),
    map(email => this.firestore.collection('claims').doc<UserClaims>(email)),
    // tap(() => console.log('fetch db')),
    switchMap(claimsRef => claimsRef.valueChanges()),
    shareReplay(1),
    // tap(() => console.log('share data')),
    // tap(console.log),
  );

  public currentUser = this.afAuth.user;

  constructor(
    private afAuth: AngularFireAuth,
    private eventLog: AngularFireAnalytics,
    private firestore: AngularFirestore,
    private router: Router,
  ) { }

  async UTPLSignWithUsername(username: string) {
    // proceed to create a new UTPL provider
    const microsoftProvider = new auth.OAuthProvider('microsoft.com');
    microsoftProvider.setCustomParameters({
      prompt: 'login',
      login_hint: `${username}@utpl.edu.ec`,
      tenant: '6eeb49aa-436d-43e6-becd-bbdf79e5077d'
    });

    await this.eventLog.logEvent('sign_an_action', { username });
    return await this.afAuth.auth.signInWithRedirect(microsoftProvider);
  }

  async signOut(redirect?: Array<string>) {
    await this.afAuth.auth.signOut();
    // this.claims.next(null);

    if (redirect)
      this.router.navigate(redirect);
  }

  get isUserSignIn() {
    return this.afAuth.user.pipe(
      map(user => !!user)
    );
  }

}
