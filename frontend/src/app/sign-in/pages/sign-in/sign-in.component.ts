import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'sgm-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignIn implements OnInit, OnDestroy {
  constructor(
    private readonly auth: UserService,
    private readonly router: ActivatedRoute,
    private readonly route: Router,
  ) { }

  private isUserSignInSub!: Subscription;

  public showSignInAlert = false;

  async ngOnInit() {

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
}
