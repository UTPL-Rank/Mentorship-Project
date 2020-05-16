import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivatedRoute } from "@angular/router";
import { User } from "firebase/app";
import { Subscription } from "rxjs";

@Component({
  selector: "sgm-dashboard-home",
  templateUrl: "./dashboard-home.page.html"
})
export class DashboardHomePage implements OnInit, OnDestroy {
  constructor(private afAuth: AngularFireAuth, private route: ActivatedRoute) {}

  private authSub: Subscription;
  user: User;

  async ngOnInit() {
    this.authSub = this.afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
