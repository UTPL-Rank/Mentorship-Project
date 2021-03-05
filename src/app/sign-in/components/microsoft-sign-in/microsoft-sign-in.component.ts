import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISignIn } from '../../models/i-sign-in';
import { IMicrosoftSignInOptions } from './i-microsoft-sign-in-options';
import { MicrosoftSignInService } from './microsoft-sign-in.service';

@Component({
  selector: 'sgm-microsoft-sign-in',
  templateUrl: './microsoft-sign-in.component.html',
  providers: [
    { provide: ISignIn, useClass: MicrosoftSignInService }
  ]
})

export class MicrosoftSignInComponent implements OnInit {

  constructor(
    private readonly fb: FormBuilder,
    private readonly microsoftSignIn: ISignIn<IMicrosoftSignInOptions>
  ) { }

  public readonly signInForm: FormGroup = this.fb.group({
    username: [null, [Validators.required]]
  });

  ngOnInit() { }

  async login() {
    const { invalid, value } = this.signInForm;
    this.signInForm.markAsTouched();

    if (invalid) return;

    const username = value.username as string;

    await this.microsoftSignIn.signIn({ username });
  }

  get usernameControl() {
    return this.signInForm.controls.username;
  }
}
