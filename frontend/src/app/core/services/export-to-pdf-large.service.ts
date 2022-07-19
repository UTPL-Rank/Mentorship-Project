import { Injectable } from '@angular/core';
// import * as html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import $ from 'jquery';

@Injectable({
  providedIn: 'root'
})

export class ExportToPdfLargeService {
  document: any;
  constructor() { }

  // exportHTMLtoPDF = async (pages, outputType = 'blob') => {
  //     const opt = {
  //         margin: [0, 0],
  //         filename: '',
  //         image: { type: 'jpeg', quality: 0.98 },
  //         html2canvas: {dpi: 192, letterRendering: true},
  //         jsPDF: { orientation: 'l', unit: 'mm', format: 'a4', fontSize: 5 }
  //     };
  //     const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4'});
  //     const pageSize = jsPDF.(opt.jsPDF);
  //     for (let i = 0; i < pages.length; i++) {
  //         const page = pages[i];
  //         const pageImage = await html2pdf().from(page).set(opt).outputImg();
  //         // tslint:disable-next-line: triple-equals
  //         if (i != 0) doc.addPage();
  //         doc.addImage(pageImage.src, 'jpeg' , opt.margin[0], opt.margin[1], pageSize.width, pageSize.height);
  //     }
  //     const pdf = doc.output('blob');
  //     return pdf;
  // }
  createPdf(filename: string, content: Element): void {
    const data: any = content;
    const htmlWidth = data.width;
    const htmlHeight = data.height;
    const topLeftMargin = 15;
    const pdfWidth = htmlWidth + (topLeftMargin * 2);
    const pdfHeight = (pdfWidth * 1.5) + (topLeftMargin * 2);
    let canvasImg;
    html2canvas(data).then((canvas) => {
      const fileWidth = 200;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const fileuri = canvas.toDataURL('image/png');
      const PDF = new jsPDF('l', 'mm', 'a4');
      const position = 0;
      PDF.addImage(fileuri, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save(filename);
    });
  }
  // createPdf(filename: string, content: Element): void {
  //     const quotes = document.getElementById('content');

  //     html2canvas(quotes, {
  //         onrendered(canvas) {

  //             // ! MAKE YOUR PDF
  //             const pdf = new jsPDF('p', 'pt', 'letter');

  //             for (let i = 0; i <= quotes.clientHeight / 980; i++) {
  //                 // ! This is all just html2canvas stuff
  //                 const srcImg = canvas;
  //                 const sX = 0;
  //                 const sY = 980 * i; // start 980 pixels down for every new page
  //                 const sWidth = 900;
  //                 const sHeight = 980;
  //                 const dX = 0;
  //                 const dY = 0;
  //                 const dWidth = 900;
  //                 const dHeight = 980;

  //                 window.onePageCanvas = document.createElement('canvas');
  //                 onePageCanvas.setAttribute('width', 900);
  //                 onePageCanvas.setAttribute('height', 980);
  //                 const ctx = onePageCanvas.getContext('2d');
  //                 // details on this usage of this function:
  //                 // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
  //                 ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

  //                 // document.body.appendChild(canvas);
  //                 const canvasDataURL = onePageCanvas.toDataURL('image/png', 1.0);

  //                 const width = onePageCanvas.width;
  //                 const height = onePageCanvas.clientHeight;

  //                 // ! If we're on anything other than the first page,
  //                 // add another page
  //                 if (i > 0) {
  //                     pdf.addPage(612, 791); // 8.5" x 11" in pts (in*72)
  //                 }
  //                 // ! now we declare that we're working on that page
  //                 pdf.setPage(i + 1);
  //                 // ! now we add content to that page!
  //                 pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .62), (height * .62));

  //             }
  //             // ! after the for loop is finished running, we save the pdf.
  //             pdf.save('Test.pdf');
  //         }
  //     });
  // }

  // createSomePdf() {
  //     var HTML_Width = $(".canvas_div_pdf").width();
  //     var HTML_Height = $(".canvas_div_pdf").height();
  //     var top_left_margin = 15;
  //     var PDF_Width = HTML_Width! + (top_left_margin * 2);
  //     var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  //     var canvas_image_width = HTML_Width;
  //     var canvas_image_height = HTML_Height;

  //     var totalPDFPages = Math.ceil(HTML_Height! / PDF_Height) - 1;


  //     html2canvas($(".canvas_div_pdf")[0], { allowTaint: true }).then(function (canvas) {
  //         canvas.getContext('2d');

  //         console.log(canvas.height + "  " + canvas.width);


  //         var imgData = canvas.toDataURL("image/jpeg", 1.0);
  //         var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
  //         pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);


  //         for (var i = 1; i <= totalPDFPages; i++) {
  //             pdf.addPage(PDF_Width, PDF_Height);
  //             // tslint:disable-next-line: max-line-length
  // tslint:disable-next-line: max-line-length
  //             pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
  //         }

  //         pdf.save("HTML-Document.pdf");
  //     });
  // }
  // exportToPDF(filename: string, content: Element) {
  //     const htmlWidth = $('#print-section').width();
  //     const htmlHeight = $('#print-section').height();

  //     const topLeftMargin = 15;

  //     // tslint:disable-next-line: no-non-null-assertion
  //     const pdfWidth = htmlWidth! + (topLeftMargin * 2);
  //     const pdfHeight = (pdfWidth * 1.5) + (topLeftMargin * 2);

  //     const canvasImageWidth = htmlWidth;
  //     const canvasImageHeight = htmlHeight;

  //     // tslint:disable-next-line: no-non-null-assertion
  //     const totalPDFPages = Math.ceil(htmlHeight! / pdfHeight) - 1;

  //     // const data = this.document.getElementById('print-section');
  //     const data = this.document.getElementById('content');
  //     html2canvas(data, { allowTaint: true }).then(canvas => {

  //       canvas.getContext('2d');
  //       const imgData = canvas.toDataURL('image/jpeg', 1.0);
  //       const pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
  //       pdf.addImage(imgData, 'png', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);

  //       for (let i = 1; i <= totalPDFPages; i++) {
  //         pdf.addPage([pdfWidth, pdfHeight], 'p');
  //         pdf.addImage(imgData, 'png', topLeftMargin, - (pdfHeight * i) + (topLeftMargin * 4), canvasImageWidth, canvasImageHeight);
  //       }

  //       pdf.save(`Document ${new Date().toLocaleString()}.pdf`);
  //     });
  //   }
  createPdfs(filename: string) {
    let data = document.getElementById('content');
    // tslint:disable-next-line: no-non-null-assertion
    html2canvas(data!).then(canvas => {
      // Few necessary setting options
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(filename); // Generated PDF
    });
  }
}
