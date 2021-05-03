import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChatComponentsModule } from './chat-components/chat-components.module';
import { ChatRoutingModule } from './chat-routing.module';



@NgModule({
  declarations: [ChatRoutingModule.pages],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    ChatComponentsModule,
  ]
})
export class ChatModule { }
