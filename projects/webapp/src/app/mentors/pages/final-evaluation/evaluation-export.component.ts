import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'projects/webapp/src/environments/environment';
import { MentorsService } from '../../../core/services/mentors.service';
import { TitleService } from '../../../core/services/title.service';
import { SigCanvasComponent } from '../../../shared/components/sig-canvas/sig-canvas.component';

@Component({
  selector: 'sgm-evaluation-export',
  templateUrl: './evaluation-export.component.html',
  styleUrls: ['./evaluation.component.scss']
})

export class EvaluationExportComponent implements OnInit {

  @ViewChild(SigCanvasComponent)
  public readonly sigCanvas: SigCanvasComponent;

  constructor(
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly mentorsService: MentorsService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Exportar Evaluación Final');
  }

  navigate() {
    const { mentorId } = this.route.snapshot.params;

    if (this.sigCanvas.isCanvasBlank()) {
      alert('Debe ingresar una firma.');
      return;
    }

    this.mentorsService.generateFinalEvaluationReport(mentorId, this.sigCanvas.getDataURL())
      .subscribe(reportId => {
        const url = `${environment.reports.mentorEvaluation}?reportId=${reportId}`;
        window.open(url, '_blank');
      });
  }
}
