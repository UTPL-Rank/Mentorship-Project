import { Component, Input } from '@angular/core';
import { SGMMessage } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-message-text',
  templateUrl: './message-text.component.html',
  styles: [
  ]
})
export class MessageTextComponent {

  public message: SGMMessage._BaseText | null = null;

  @Input('message')
  set _setMessage(message: SGMMessage.readDto) {
    if (message.kind === 'SGM#TEXT')
      this.message = message;
    else
      throw new Error('Message kind incorrect, instead use a valid tag.');
  }

}
