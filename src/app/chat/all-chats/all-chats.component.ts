import { Component, OnInit } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { CreateChatService } from './create-chat.service';
import { ListActiveChatsService } from './list-active-chats.service';

@Component({
  selector: 'sgm-all-chats',
  templateUrl: './all-chats.component.html',
  providers: [
    CreateChatService,
    ListActiveChatsService,
  ]
})
export class AllChatsComponent implements OnInit {

  constructor(
    private readonly creator: CreateChatService,
    private readonly lister: ListActiveChatsService,
  ) { }

  public readonly chats$ = this.lister.chats$.pipe(
    shareReplay(1),
  );

  ngOnInit(): void {
  }

  create(): void {
    this.creator.create().subscribe(id => {
      console.log(id);
    });
  }

}
