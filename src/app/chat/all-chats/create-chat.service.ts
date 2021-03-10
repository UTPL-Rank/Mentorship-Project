import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SGMChat, SGMUser } from '@utpl-rank/sgm-helpers';
import { ChatParticipant } from '@utpl-rank/sgm-helpers/models/chat/chat-participant';
import firebase from 'firebase/app';
import { from, Observable } from 'rxjs';
import { BrowserLoggerService } from '../../core/services/browser-logger.service';

@Injectable({
  providedIn: 'root'
})
export class CreateChatService {

  constructor(
    private readonly afFirestore: AngularFirestore,
    private readonly logger: BrowserLoggerService,
  ) { }

  create(): Observable<string | null> {

    return from(this.createChat());
  }

  private async createChat(): Promise<string | null> {
    const [username1, username2] = this.requestUsername();

    const user1 = await this.getUser(username1);
    const user2 = await this.getUser(username2);

    const chat = this.createChatDto(user1, user2);

    const chatID = await this.saveChat(chat);
    return chatID;
  }

  private async getUser(username: string): Promise<SGMUser.readDto> {
    const doc = await this.afFirestore.collection('users').doc<SGMUser.readDto>(username).ref.get();

    if (doc.exists)
      return doc.data() as SGMUser.readDto;

    throw new Error('User not found ' + username);
  }

  private async saveChat(chat: SGMChat.functions.createDto): Promise<string | null> {
    const chatsCollection = this.afFirestore.collection<SGMChat.functions.createDto>('chats').ref;

    // search chat doesn't exists
    const searchQuery = chatsCollection
      .where('participantsUid', 'array-contains', chat.participants[0].uid);

    const coincidences = await searchQuery.get();
    const one = coincidences.docs
      .filter(c => (c.exists ? c.data() as unknown as SGMChat.readDto : null)?.participantsUid.includes(chat.participants[1].uid));

    if (one.length !== 0)
      return one[0].id;

    // save chat
    try {
      await chatsCollection.doc(chat.id).set(chat);
      return chat.id;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  private createChatDto(sender: SGMUser.readDto, receiver: SGMUser.readDto): SGMChat.functions.createDto {
    const id = this.afFirestore.createId();
    const senderDto: ChatParticipant = {
      displayName: sender.displayName,
      email: sender.email,
      uid: sender.uid,
    };

    const receiverDto: ChatParticipant = {
      displayName: receiver.displayName,
      email: receiver.email,
      uid: receiver.uid,
    };

    const chat: SGMChat.functions.createDto = {
      disabled: false,
      lastMessage: null,
      participants: [senderDto, receiverDto],
      participantsUid: [sender.uid, receiver.uid],
      id,
      lastActivity: firebase.firestore.FieldValue.serverTimestamp()
    };

    return chat;
  }

  private requestUsername(): [string, string] {
    const username1 = prompt('Ingresa el username del usuario 1');
    const username2 = prompt('Ingresa el username del usuario 2');

    if (username1 && username2)
      return [username1, username2];

    throw new Error('Insert valid credentials');
  }
}
