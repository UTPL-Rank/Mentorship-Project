import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { SGMChat } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatInformationService {

  constructor(
    private readonly afFirestore: AngularFirestore,
  ) { }

  chat$(chatId: string): Observable<SGMChat.readDto | null> {
    return this.chatDocument(chatId)
      .valueChanges()
      .pipe(
        map(doc => doc ? doc as SGMChat.readDto : null)
      );
  }

  private chatDocument(chatId: string): AngularFirestoreDocument<SGMChat.readDto> {
    return this.afFirestore.collection('chats').doc<SGMChat.readDto>(chatId);
  }
}
