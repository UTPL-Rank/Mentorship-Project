import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase/app";
import { Subscription } from "rxjs";

@Component({
  selector: "sgm-dashboard-home",
  templateUrl: "./dashboard-home.page.html"
})
export class DashboardHomePage implements OnInit, OnDestroy {
  constructor(private afAuth: AngularFireAuth) { }

  private authSub: Subscription;
  user: User;

  async ngOnInit() {
    this.authSub = this.afAuth.authState.subscribe(user => {
      this.user = user;
      user.getIdToken(true);
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
