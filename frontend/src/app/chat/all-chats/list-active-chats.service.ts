import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SGMChat } from '@utpl-rank/sgm-helpers';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ListActiveChatsService {

  constructor(
    private readonly afFirestore: AngularFirestore,
    private readonly userService: UserService,
  ) { }

  public readonly chats$ = this.userService.user$.pipe(
    switchMap(user => !!user
      ? this.afFirestore
        .collection<SGMChat.readDto>(
          'chats', q => q.where('participantsUsernames', 'array-contains', user?.username ?? user.email.split('@')[0])
        ).valueChanges()
      : of(null))
  );
}
