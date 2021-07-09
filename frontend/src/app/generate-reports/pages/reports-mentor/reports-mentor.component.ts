import { Component, OnInit } from '@angular/core';
import { ExportToPdfService } from '../../../core/services/export-to-pdf.service';


@Component({
  selector: 'sgm-reports-mentor',
  templateUrl: './reports-mentor.component.html',
  styles: [
  ]
})
export class ReportsMentorComponent implements OnInit {

  public TITLE_COVER = 'FICHAS DE ACOMPAÑAMIENTO MENTORIAL';
  public TYPE_COVER = 'Estudiante mentor';

  constructor(
    private exportToPdfService: ExportToPdfService
  ) { }

  ngOnInit(): void {
  }

  toPdf(): void {
    this.exportToPdfService.generate('odmendoza');
  }

}
