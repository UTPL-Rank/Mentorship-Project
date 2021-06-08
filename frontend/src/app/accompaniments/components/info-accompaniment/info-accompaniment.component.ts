import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { SGMAccompaniment } from '@utpl-rank/sgm-helpers';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'sgm-info-accompaniment',
  templateUrl: './info-accompaniment.component.html'
})
export class InfoAccompanimentComponent implements OnInit, OnDestroy {
  
  constructor(
    private readonly auth: UserService,
  ) { }

  public accompaniment!: SGMAccompaniment.readDTO;

  @Input('accompaniment')
  public set _setAccompaniment(accompaniment: SGMAccompaniment.readDTO) {
    this.accompaniment = accompaniment;
  }

  public isAdmin = false;

  private sub: Subscription | null = null;

  ngOnInit(): void {
    this.sub = this.auth.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin);
    
  }
  

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
