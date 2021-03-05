import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { SGMMessage, SGMUser } from '@utpl-rank/sgm-helpers';
import firebase from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { BrowserLoggerService } from '../../core/services/browser-logger.service';
import { UserService } from '../../core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CreateTextMessageService {

  constructor(
    private readonly afFirestore: AngularFirestore,
    private readonly logger: BrowserLoggerService,
    private readonly user: UserService,
  ) { }

  send$(chatId: string, text: string): Observable<string | null> {
    return this.user.user$.pipe(
      take(1),
      switchMap(user => user ? from(this.send(user, chatId, text)) : of(null)),
    );
  }

  private async send(user: SGMUser.readDto, chatId: string, text: string): Promise<string | null> {
    const message = this.createMessage(user, text);
    const doc = this.messageDocument(chatId, message.id);

    try {
      await doc.set(message);
      return message.id;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  private createMessage(user: SGMUser.readDto, text: string): SGMMessage.createText {
    const id = this.afFirestore.createId();
    const textMessage: SGMMessage.createText = {
      id,
      kind: 'SGM#TEXT',
      accompaniment: null,
      asset: null,
      banned: false,
      text,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      sender: {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        username: user.username ?? user.email.split('@')[0],
      }
    };

    return textMessage;
  }

  private messageDocument(chatId: string, messageId: string): AngularFirestoreDocument<SGMMessage.createText> {
    return this.afFirestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc<SGMMessage.createText>(messageId);
  }
}
