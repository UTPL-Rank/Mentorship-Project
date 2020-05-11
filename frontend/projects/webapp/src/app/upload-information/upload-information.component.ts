import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AcademicPeriod } from '../models/models';

@Component({
  selector: 'sgm-upload-information',
  templateUrl: './upload-information.component.html'
})
export class UploadInformationComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute) { }

  private sub: Subscription;
  public period: AcademicPeriod;

  ngOnInit(): void {
    this.sub = this.route.data.subscribe(data => {
      this.period = data.activePeriod;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
