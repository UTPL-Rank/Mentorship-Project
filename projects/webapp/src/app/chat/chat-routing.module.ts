import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllChatsComponent } from './all-chats/all-chats.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'todos', component: AllChatsComponent },
  { path: ':id', component: ChatComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'todos' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {
  static pages = [
    AllChatsComponent,
    ChatComponent,
  ];
}
