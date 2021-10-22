import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { SGMUser } from '@utpl-rank/sgm-helpers';
import { User } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators';
import { Notification } from '../../models/notification.model';
import { UserSignature } from '../../models/user';
import { UserClaims } from '../../models/user-claims';
import { BrowserLoggerService } from './browser-logger.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private readonly firestore: AngularFirestore,
    private readonly afAuth: AngularFireAuth,
    private readonly logger: BrowserLoggerService,
    private readonly router: Router,
  ) { }

  public readonly currentUser = this.afAuth.user;

  public readonly username$: Observable<string | null> = this.currentUser.pipe(
    filter(user => !!user),
    map(user => user?.email?.split('@')[0] || null),
    shareReplay(1),
  );

  public readonly user$: Observable<SGMUser.readDto | null> = this.username$.pipe(
    switchMap(username => username ? this.firestore.collection('users').doc<SGMUser.readDto>(username).valueChanges() : of(null)),
    map(doc => doc ? doc as SGMUser.readDto : null),
    shareReplay(1),
  );

  public readonly uid$ = this.user$.pipe(
    map(user => user?.uid ?? null)
  );

  public claims: Observable<UserClaims | null> = this.username$.pipe(
    switchMap(username => !!username ? this.claimsDocument(username).snapshotChanges() : of(null)),
    map(snapshot => snapshot?.payload.exists ? snapshot.payload.data() : null),
    shareReplay(1),
  );

  public isAdmin: Observable<boolean> = this.claims.pipe(
    map(claims => !!claims?.isAdmin)
  );

  public notificationsStream: Observable<Array<Notification>> = this.username$.pipe(
    map(username => username ? this.firestore.collection('users').doc(username) : null),
    map(userDoc => userDoc?.collection<Notification>('notifications', q => q.limit(9).orderBy('time', 'desc'))),
    switchMap(claimsRef => !!claimsRef ? claimsRef.valueChanges() : of([])),
    shareReplay(1),
  );


  public readonly signature$: Observable<UserSignature | null> = this.username$.pipe(
    switchMap(username => (username) ? this.signatureDocument(username).get() : of(null)),
    map(snap => snap?.exists ? snap.data() as UserSignature : null),
    shareReplay(1),
  );

  public signatureOf(username: string): Observable<UserSignature | null> {
    return this.signatureDocument(username).get().pipe(
        map(snap => snap?.exists ? snap.data() as UserSignature : null),
        shareReplay(1)
      );
  }

  public currentUserData: Observable<{ [key: string]: any } | null> = this.username$.pipe(
    switchMap(username => username ? this.userDocument(username).valueChanges() : of(null)),
    map(data => data ?? null),
    shareReplay(1),
  );

  async signOut(redirect?: Array<string>) {
    await this.afAuth.signOut();
    // this.claims.next(null);

    if (redirect)
      this.router.navigate(redirect);
  }

  get isUserSignIn() {
    return this.afAuth.user.pipe(
      map(user => !!user)
    );
  }

  private userDocument(username: string): AngularFirestoreDocument<User> {
    const userDoc = this.firestore.collection('users').doc<User>(username);
    return userDoc;
  }

  private signatureDocument(username: string): AngularFirestoreDocument<UserSignature> {
    const signature = this.firestore
      .collection('users')
      .doc(username)
      .collection('account-configuration')
      .doc<UserSignature>('signature');
    return signature;
  }

  public claimsDocument(username: string): AngularFirestoreDocument<UserClaims> {
    const claims = this.firestore
      .collection('users')
      .doc(username)
      .collection('account-configuration')
      .doc<UserClaims>('claims');
    return claims;
  }

  public saveSignature(data: string): Observable<boolean> {
    const saveTask = this.username$.pipe(
      take(1),
      mergeMap(async username => username ? await this.signatureDocument(username).set({ data }) : null),
      map(() => true),
      catchError((err) => {
        this.logger.error(err);
        return of(false);
      }),
    );

    return saveTask;
  }

  /**
   * Toggle the read status to `read: true` on a specific notification
   *
   * TODO: create own service for notifications
   *
   * @param username identifier of the user
   * @param notificationId identifier of the notification
   */
  public toggleNotificationRead(notificationId: string): Observable<boolean> {
    const updateVal = { read: true };

    const update = this.username$.pipe(
      map(username => username ? this.firestore.collection('users').doc(username).collection('notifications').doc<Notification>(notificationId) : null),
      mergeMap(async ref => await ref?.update(updateVal)),
      map(() => true),
      catchError(() => of(false))
    );

    return update;
  }
}
