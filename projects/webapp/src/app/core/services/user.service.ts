import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators';
import { User, UserClaims, UserSignature } from '../../models/models';
import { Notification } from '../../models/notification.model';
import { BrowserLoggerService } from './browser-logger.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private readonly firestore: AngularFirestore,
        private readonly afAuth: AngularFireAuth,
        private readonly logger: BrowserLoggerService,
        private readonly eventLog: AngularFireAnalytics,
        private readonly router: Router,
    ) { }

    public readonly currentUser = this.afAuth.user;

    public readonly username: Observable<string> = this.currentUser.pipe(
        filter(user => !!user),
        map(user => user.email),
        map(email => email.split('@')[0]),
        shareReplay(1),
    );

    public claims: Observable<UserClaims | null> = this.username.pipe(
        map(username => this.claimsDocument(username)),
        switchMap(claimsRef => claimsRef.snapshotChanges()),
        map(snapshot => snapshot.payload.exists ? snapshot.payload.data() : null),
        shareReplay(1),
    );

    public isAdmin: Observable<boolean> = this.claims.pipe(
        map(claims => claims.isAdmin)
    );


    public notificationsStream: Observable<Array<Notification>> = this.username.pipe(
        map(username => this.firestore.collection('users').doc(username)),
        map(userDoc => userDoc.collection<Notification>('notifications', q => q.limit(9).orderBy('time', 'desc'))),
        switchMap(claimsRef => claimsRef.valueChanges()),
        shareReplay(1),
    );


    public readonly signature$: Observable<UserSignature | null> = this.username.pipe(
        map(username => this.signatureDocument(username)),
        switchMap(doc => doc.get()),
        map(snap => snap.exists ? snap.data() as UserSignature : null),
        shareReplay(1),
    );

    public currentUserData: Observable<User> = this.username.pipe(
        map(username => this.userDocument(username)),
        switchMap(userDoc => userDoc.valueChanges()),
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
        const saveTask = this.username.pipe(
            take(1),
            map(username => this.signatureDocument(username)),
            mergeMap(doc => doc.set({ data })),
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
