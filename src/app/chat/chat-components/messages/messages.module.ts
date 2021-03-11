import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessageAccompanimentComponent } from './message-accompaniment/message-accompaniment.component';
import { MessageBannedComponent } from './message-banned/message-banned.component';
import { MessageBaseComponent } from './message-base/message-base.component';
import { MessageDocumentComponent } from './message-document/message-document.component';
import { MessageImageComponent } from './message-image/message-image.component';
import { MessageTextDateComponent } from './message-text-date/message-text-date.component';
import { MessageTextSenderComponent } from './message-text-sender/message-text-sender.component';
import { MessageTextComponent } from './message-text/message-text.component';
import { MessageVideoComponent } from './message-video/message-video.component';
import { MessageComponent } from './message.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MessageComponent,
    MessageTextComponent,
    MessageImageComponent,
    MessageVideoComponent,
    MessageDocumentComponent,
    MessageBannedComponent,
    MessageAccompanimentComponent,
    MessageBaseComponent,
    MessageTextSenderComponent,
    MessageTextDateComponent,
  ],
  exports: [
    MessageComponent,
  ]
})
export class MessagesModule { }
