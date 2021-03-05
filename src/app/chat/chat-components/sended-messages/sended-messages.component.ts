import { Component, Input } from '@angular/core';
import { SGMMessage } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-sended-messages',
  templateUrl: './sended-messages.component.html',
})
export class SendedMessagesComponent {

  public messages: Array<SGMMessage.readDto> | null = null;

  @Input('messages')
  set _setMessages(messages: Array<SGMMessage.readDto>) {
    this.messages = messages;
  }

}
