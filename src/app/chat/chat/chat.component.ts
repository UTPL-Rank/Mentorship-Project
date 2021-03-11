import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
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
    private readonly userService: UserService,
    private readonly location: Location
  ) { }

  @ViewChild('scroll', { static: true })
  private readonly scrollRef: ElementRef<HTMLDivElement> | null = null;

  private readonly chatId$ = this.route.params.pipe(
    map(params => params.chatId as string),
  );

  private readonly chat$ = this.chatId$.pipe(
    switchMap(chatId => this.chatInformation.chat$(chatId)),
    shareReplay(1),
  );

  public readonly chatParticipantTitle$ = combineLatest([this.userService.uid$, this.chat$]).pipe(
    map(([uid, chat]) => chat?.participants?.filter(part => part.uid !== uid)), // filter myself from participants
    map(participants => participants?.map(p => p.displayName).join(', '))
  )

  public readonly messages$ = this.chatId$.pipe(
    switchMap(chatId => this.messagesLister.messages$(chatId)),
    shareReplay(1),
    tap(() => this.scrollBottom()),
  );

  ngOnInit(): void { }

  sendMessage(text: string) {
    this.chatId$.pipe(
      switchMap(chatId => this.messageCreator.send$(chatId, text))
    ).subscribe(console.log)
  }

  private scrollBottom(): void {
    const el = this.scrollRef?.nativeElement;
    if (el) {
      const top = el.scrollHeight;

      const timer = setTimeout(() => {
        el.scroll({ top, behavior: 'smooth' });
        clearTimeout(timer);
      }, 1000);
    }
  }
}
