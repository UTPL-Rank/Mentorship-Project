import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, shareReplay, switchMap } from 'rxjs/operators';
import { Notification, UserClaims } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly eventLog: AngularFireAnalytics,
    private readonly firestore: AngularFirestore,
    private readonly router: Router,
  ) { }

  public currentUser = this.afAuth.user;

  public claims: Observable<UserClaims> = this.afAuth.user.pipe(
    filter(user => !!user),
    map(user => user.email),
    map(email => this.firestore.collection('claims').doc<UserClaims>(email)),
    switchMap(claimsRef => claimsRef.valueChanges()),
    shareReplay(1),
  );

  public isAdmin: Observable<boolean> = this.claims.pipe(
    map(claims => claims.isAdmin)
  );

  public username: Observable<string> = this.afAuth.user.pipe(
    filter(user => !!user),
    map(user => user.email),
    map(email => email.split('@')[0]),
  );

  public notificationsStream: Observable<Array<Notification>> = this.username.pipe(
    map(username => this.firestore.collection('users').doc(username)),
    map(userDoc => userDoc.collection<Notification>('notifications', q => q.limit(9).orderBy('time', 'desc'))),
    switchMap(claimsRef => claimsRef.valueChanges()),
    shareReplay(1),
  );

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

  /**
   * Toggle the read status to `read: true` on a specific notification
   * @param username identifier of the user
   * @param notificationId identifier of the notification
   */
  public toggleNotificationRead(notificationId: string): Observable<boolean> {
    const updateVal = { read: true };

    const update = this.currentUser.pipe(
      map(user => user.email.split('@')[0]),
      map(username => this.firestore.collection('users').doc(username).collection('notifications').doc<Notification>(notificationId)),
      mergeMap(async ref => await ref.update(updateVal)),
      map(() => true),
      catchError(() => of(false))
    );

    return update;
  }
}
