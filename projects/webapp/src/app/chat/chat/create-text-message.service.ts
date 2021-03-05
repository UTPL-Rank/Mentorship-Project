import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { SGMMessage } from '@utpl-rank/sgm-helpers';
import firebase from 'firebase/app';
import { from, Observable } from 'rxjs';
import { BrowserLoggerService } from '../../core/services/browser-logger.service';

@Injectable({
  providedIn: 'root'
})
export class CreateTextMessageService {

  constructor(
    private readonly afFirestore: AngularFirestore,
    private readonly logger: BrowserLoggerService,
  ) { }

  send$(chatId: string, text: string): Observable<string | null> {
    return from(this.send(chatId, text));
  }

  private async send(chatId: string, text: string): Promise<string | null> {
    const collection = this.messagesCollection(chatId);
    const message = this.createMessage(text);

    try {
      const response = await collection.add(message);
      return response.id;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  private createMessage(text: string): SGMMessage.createDto {
    const textMessage: SGMMessage.createDto = {
      kind: 'SGM#TEXT',
      accompaniment: null,
      asset: null,
      banned: false,
      text,
      date: firebase.firestore.FieldValue.serverTimestamp(),
    };

    return textMessage;
  }

  private messagesCollection(chatId: string): AngularFirestoreCollection<SGMMessage.createDto> {
    return this.afFirestore
      .collection('chats')
      .doc(chatId)
      .collection<SGMMessage.createDto>('messages');
  }
}
