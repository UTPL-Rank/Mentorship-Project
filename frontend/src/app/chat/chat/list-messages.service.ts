import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { SGMMessage } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListMessagesService {

  constructor(
    private readonly afFirestore: AngularFirestore,
  ) { }

  public messages$(chatId: string): Observable<Array<SGMMessage.readDto>> {
    return this.messagesCollection(chatId).valueChanges();
  }

  private messagesCollection(chatId: string): AngularFirestoreCollection<SGMMessage.readDto> {
    return this.afFirestore
      .collection('chats')
      .doc(chatId)
      .collection<SGMMessage.readDto>('messages', q => q.orderBy('date', 'asc'));
  }
}
