import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Subscription } from "rxjs";
import { FirestoreAccompaniment } from "../../../models/models";

@Component({
  selector: "sgm-info-accompaniment",
  templateUrl: "./info-accompaniment.component.html"
})
export class InfoAccompanimentComponent implements OnInit, OnDestroy {
  constructor(private afAuth: AngularFireAuth) { }

  @Input()
  public accompaniment: FirestoreAccompaniment;
  public isAdmin = false;
  private sub: Subscription;

  ngOnInit(): void {
    this.sub = this.afAuth.user.subscribe(async user => {
      const { claims } = await user.getIdTokenResult();
      this.isAdmin = claims.isAdmin;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
