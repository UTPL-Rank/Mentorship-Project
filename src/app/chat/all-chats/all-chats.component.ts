import { Component, OnInit } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
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
    private readonly userService: UserService
  ) { }

  public readonly chats$ = this.lister.chats$.pipe(
    shareReplay(1),
  );

  public readonly uid$ = this.userService.user$.pipe(
    map(user => user?.uid ?? null),
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
