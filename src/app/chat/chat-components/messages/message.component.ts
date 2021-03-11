import { Component, Input } from '@angular/core';
import { SGMMessage } from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-message',
  templateUrl: './message.component.html',
  styles: [
  ]
})
export class MessageComponent {

  public message: SGMMessage.readDto | null = null;

  @Input('message')
  set _setMessage(message: SGMMessage.readDto) {
    this.message = message;
  }

}
