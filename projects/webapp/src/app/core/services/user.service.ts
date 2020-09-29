import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { User } from '../../models/models';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private readonly firestore: AngularFirestore,
        private readonly auth: AuthenticationService,
    ) { }

    public username: Observable<string> = this.auth.username;

    public currentUserData: Observable<User> = this.username.pipe(
        map(username => this.userDocument(username)),
        switchMap(userDoc => userDoc.valueChanges()),
        shareReplay(1),
    );

    private userDocument(username: string): AngularFirestoreDocument<User> {
        const userDoc = this.firestore.collection('users').doc<User>(username);
        return userDoc;
    }

}
