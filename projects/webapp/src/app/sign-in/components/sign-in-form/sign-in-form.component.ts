import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'sgm-sign-in-form',
  templateUrl: './sign-in-form.component.html'
})

export class SignInFormComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: UserService,
  ) { }

  public signInForm: FormGroup;


  ngOnInit() {
    this.signInForm = this.fb.group({
      username: [null, Validators.required]
    });
  }

  async login() {
    const { invalid, value } = this.signInForm;
    this.signInForm.markAsTouched();

    if (invalid) return;

    await this.auth.UTPLSignWithUsername(value.username);
  }

  get usernameControl() {
    return this.signInForm.controls.username;
  }
}
