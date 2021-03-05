import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageAccompanimentComponent } from './message-accompaniment/message-accompaniment.component';
import { MessageBannedComponent } from './message-banned/message-banned.component';
import { MessageBaseComponent } from './message-base/message-base.component';
import { MessageDocumentComponent } from './message-document/message-document.component';
import { MessageImageComponent } from './message-image/message-image.component';
import { MessageTextComponent } from './message-text/message-text.component';
import { MessageVideoComponent } from './message-video/message-video.component';
import { SendBoxComponent } from './send-box/send-box.component';
import { SendedMessagesComponent } from './sended-messages/sended-messages.component';


@NgModule({
  declarations: [
    SendBoxComponent,
    MessageTextComponent,
    MessageImageComponent,
    MessageVideoComponent,
    MessageDocumentComponent,
    MessageBannedComponent,
    MessageAccompanimentComponent,
    MessageBaseComponent,
    SendedMessagesComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    SendedMessagesComponent,
    SendBoxComponent,
  ]
})
export class ChatComponentsModule { }
