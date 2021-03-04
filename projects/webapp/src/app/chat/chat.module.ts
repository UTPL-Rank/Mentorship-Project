import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChatRoutingModule } from './chat-routing.module';



@NgModule({
  declarations: [ChatRoutingModule.pages],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
