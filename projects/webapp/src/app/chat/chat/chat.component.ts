import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ChatInformationService } from './chat-information.service';
import { CreateTextMessageService } from './create-text-message.service';
import { ListMessagesService } from './list-messages.service';

@Component({
  selector: 'sgm-chat',
  templateUrl: './chat.component.html',
  providers: [
    ChatInformationService,
    ListMessagesService,
  ]
})
export class ChatComponent implements OnInit {

  constructor(
    private readonly chatInformation: ChatInformationService,
    private readonly messagesLister: ListMessagesService,
    private readonly messageCreator: CreateTextMessageService,
    private readonly route: ActivatedRoute,
  ) { }

  private readonly chatId$ = this.route.params.pipe(
    map(params => params.chatId as string),
  );

  public readonly chat$ = this.chatId$.pipe(
    switchMap(chatId => this.chatInformation.chat$(chatId)),
    shareReplay(1),
  );

  public readonly messages$ = this.chatId$.pipe(
    switchMap(chatId => this.messagesLister.messages$(chatId)),
    shareReplay(1),
  );

  ngOnInit(): void {
  }

  sendMessage() {
    this.chatId$.pipe(
      switchMap(chatId => this.messageCreator.send$(chatId, 'asd'))
    ).subscribe(console.log)

  }

}
