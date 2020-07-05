import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MentorsService } from '../../../core/services/mentors.service';
import { TitleService } from '../../../core/services/title.service';
import { Mentor } from '../../../models/models';
import { SigCanvasComponent } from '../../../shared/components/sig-canvas/sig-canvas.component';

@Component({
  selector: 'sgm-final-evaluation',
  templateUrl: './final-evaluation.component.html'
})

export class FinalEvaluationComponent implements OnInit {

  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
    private readonly router: Router,
  ) { }

  @ViewChild(SigCanvasComponent)
  public readonly sigCanvas: SigCanvasComponent;

  public readonly mentorObs: Observable<Mentor> = this.route.params.pipe(
    switchMap(params => this.mentorsService.mentorStream(params.mentorId)),
    tap(mentor => this.title.setTitle(mentor.displayName.toUpperCase())),
  );

  ngOnInit() { }

  async navigate(mentorId: string) {
    if (this.sigCanvas.isCanvasBlank()) {
      alert('Debe ingresar una firma.');
      return;
    }
    // http://localhost:4200/panel-control/reportes/evaluacion-final/g5Hmy2gSn6MYXYqzsTaT

    await this.router.navigate(
      [
        '/panel-control',
        'reportes',
        'evaluacion-final',
        mentorId,
      ],
      {
        queryParams: {
          signature: this.sigCanvas.getDataURL()
        }
      }
    );
  }
}
