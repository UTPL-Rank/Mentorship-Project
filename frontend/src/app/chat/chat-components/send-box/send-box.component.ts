import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sgm-send-box',
  templateUrl: './send-box.component.html',
  styles: [
  ]
})
export class SendBoxComponent {

  constructor(
    private readonly fb: FormBuilder,
  ) { }

  @Output()
  private readonly send = new EventEmitter<string>();

  public readonly sendForm: FormGroup = this.fb.group({
    message: [null, Validators.required],
  });

  public sender(): void {
    const { invalid, value: { message } } = this.sendForm;

    if (invalid)
      return;

    this.send.emit(message);
    this.sendForm.reset();
  }
}

