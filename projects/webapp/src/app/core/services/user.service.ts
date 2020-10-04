import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators';
import { User, UserSignature } from '../../models/models';
import { AuthenticationService } from './authentication.service';
import { BrowserLoggerService } from './browser-logger.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private readonly firestore: AngularFirestore,
        private readonly auth: AuthenticationService,
        private readonly logger: BrowserLoggerService,
    ) { }

    public readonly username: Observable<string> = this.auth.username.pipe(
        shareReplay(1),
    );

    public readonly signature$: Observable<UserSignature> = this.username.pipe(
        map(username => this.signatureDocument(username)),
        switchMap(doc => doc.valueChanges()),
        shareReplay(1),
    );

    public currentUserData: Observable<User> = this.username.pipe(
        map(username => this.userDocument(username)),
        switchMap(userDoc => userDoc.valueChanges()),
        shareReplay(1),
    );

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
}
