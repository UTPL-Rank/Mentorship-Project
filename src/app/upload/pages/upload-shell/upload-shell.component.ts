import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sgm-upload-shell',
  templateUrl: './upload-shell.component.html'
})
export class UploadShellComponent {

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  public periodObs: Observable<SGMAcademicPeriod.readDTO> = this.route.data
    .pipe(map(data => data.activePeriod));
}
