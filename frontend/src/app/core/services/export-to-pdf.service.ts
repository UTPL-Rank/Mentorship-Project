import { Injectable } from '@angular/core';

// @ts-ignore
import * as html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class ExportToPdfService {

  constructor() { }

  generate(filename: string, content: Element): void {
    const options = {
      margin: 1,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        fontSize: 5
      },
      // pagebreak: { mode: 'avoid-all', before: '.report-student-content' }
    };

    // @ts-ignore
    // const content: Element = document.getElementById('content');

    html2pdf()
      .from(content)
      .set(options)
      .save();
  }
}
