import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcademicPeriod } from '../../../models/models';

@Component({
  selector: 'sgm-selected-period-badge',
  templateUrl: './selected-period-badge.component.html'
})

export class SelectedPeriodBadgeComponent {

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  public readonly isCurrentPeriodActive$: Observable<boolean> = this.route.data.pipe(
    map(data => data.activePeriod as AcademicPeriod),
    map(period => period.current)
  );
}
