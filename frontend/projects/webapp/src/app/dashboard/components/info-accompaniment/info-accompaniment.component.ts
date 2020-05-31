import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from '../../../core/services/authentication.service';
import { FirestoreAccompaniment } from "../../../models/models";

@Component({
  selector: "sgm-info-accompaniment",
  templateUrl: "./info-accompaniment.component.html"
})
export class InfoAccompanimentComponent implements OnInit, OnDestroy {
  constructor(private auth: AuthenticationService) { }

  @Input()
  public accompaniment: FirestoreAccompaniment;
  public isAdmin = false;
  private sub: Subscription;

  ngOnInit(): void {
    this.sub = this.auth.claims
      .subscribe(claims => this.isAdmin = claims.isAdmin);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
