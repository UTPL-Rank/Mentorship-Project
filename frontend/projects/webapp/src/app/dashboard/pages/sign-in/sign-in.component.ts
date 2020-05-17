import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sgm-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInPage implements OnInit, OnDestroy {
  constructor(
    private afAuth: AngularFireAuth,
    private router: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder
  ) { }

  private authSub: Subscription;
  public showSignInAlert = false;
  public usernameControl: FormControl;

  async ngOnInit() {
    this.usernameControl = this.fb.control(null, Validators.required);

    this.authSub = this.afAuth.authState.subscribe(user => {
      const { redirect } = this.router.snapshot.queryParams;

      if (!!user && !!redirect) {
        return this.route.navigateByUrl(redirect);
      }

      if (!user && !!redirect) {
        this.showSignInAlert = true;
        return;
      }

      this.route.navigateByUrl('/');
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  login() {
    const { invalid, value } = this.usernameControl;
    this.usernameControl.markAsTouched();

    // validate an username was provided
    if (invalid) return;

    // proceed to create provider, with the provided username
    const microsoftProvider = new auth.OAuthProvider('microsoft.com');
    microsoftProvider.setCustomParameters({
      prompt: 'login',
      login_hint: `${value}@utpl.edu.ec`,
      tenant: '6eeb49aa-436d-43e6-becd-bbdf79e5077d'
    });

    // redirect user to sign in page
    this.afAuth.auth.signInWithRedirect(microsoftProvider);
  }
}
