import { Component } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { ListActiveChatsService } from './list-active-chats.service';

@Component({
  selector: 'sgm-all-chats',
  templateUrl: './all-chats.component.html',
  providers: [
    ListActiveChatsService,
  ]
})
export class AllChatsComponent {

  constructor(
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

}
