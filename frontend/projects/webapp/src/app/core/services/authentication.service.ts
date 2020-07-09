import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { Notification, UserClaims } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  public claims: Observable<UserClaims> = this.afAuth.user.pipe(
    filter(user => !!user),
    map(user => user.email),
    map(email => this.firestore.collection('claims').doc<UserClaims>(email)),
    switchMap(claimsRef => claimsRef.valueChanges()),
    shareReplay(1),
  );

  public notifications: Observable<Array<Notification>> = this.afAuth.user.pipe(
    filter(user => !!user),
    map(user => user.email),
    map(email => this.firestore.collection('users').doc(email.split('@')[0])),
    map(userDoc => userDoc.collection<Notification>('notifications', q => q.limit(10))),
    switchMap(claimsRef => claimsRef.valueChanges()),
    shareReplay(1),
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
