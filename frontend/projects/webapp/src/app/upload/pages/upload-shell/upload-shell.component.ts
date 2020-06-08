import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcademicPeriod } from '../../../models/models';

@Component({
  selector: 'sgm-upload-shell',
  templateUrl: './upload-shell.component.html'
})
export class UploadShellComponent {

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  public periodObs: Observable<AcademicPeriod> = this.route.data
    .pipe(map(data => data.activePeriod));
}
