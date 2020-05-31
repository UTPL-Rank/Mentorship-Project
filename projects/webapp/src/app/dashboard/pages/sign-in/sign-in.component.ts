import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'sgm-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInPage implements OnInit, OnDestroy {
  constructor(
    private auth: AuthenticationService,
    private router: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder,
  ) { }

  private isUserSignInSub: Subscription;

  public showSignInAlert = false;
  public usernameControl: FormControl;

  async ngOnInit() {
    this.usernameControl = this.fb.control(null, Validators.required);

    this.isUserSignInSub = this.auth.isUserSignIn
      .subscribe(isSignIn => {
        const { redirect } = this.router.snapshot.queryParams;

        if (!isSignIn) {
          this.showSignInAlert = true;
          return;
        }

        if (redirect)
          return this.route.navigateByUrl(redirect);

        this.route.navigateByUrl('/panel-control');
      });
  }

  ngOnDestroy() {
    this.isUserSignInSub.unsubscribe();
  }

  async login() {
    const { invalid, value } = this.usernameControl;
    this.usernameControl.markAsTouched();

    if (invalid) return;

    this.auth.UTPLSignWithUsername(value);
  }


}
