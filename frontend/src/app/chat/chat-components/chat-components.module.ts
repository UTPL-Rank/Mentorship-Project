import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from './messages/messages.module';
import { SendBoxComponent } from './send-box/send-box.component';

@NgModule({
  declarations: [
    SendBoxComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessagesModule,
  ],
  exports: [
    SendBoxComponent,
    MessagesModule,
  ]
})
export class ChatComponentsModule { }
