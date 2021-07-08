import {Component, ViewChild, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {SGMAccompaniment, SGMMentor, SGMStudent} from '@utpl-rank/sgm-helpers';

import {AccompanimentsService} from '../../../core/services/accompaniments.service';
import {MentorsService} from '../../../core/services/mentors.service';
import {StudentsService} from '../../../core/services/students.service';
import {UserService} from '../../../core/services/user.service';

// @ts-ignore
import * as html2pdf from 'html2pdf.js';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {Observable, Subscription} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Component({
  selector: 'sgm-student-report',
  templateUrl: './student-report.component.html',
  styles: []
})
export class StudentReportComponent implements OnInit, OnDestroy {

  // data
  public accompaniments!: SGMAccompaniment.readDTO[];
  public student!: SGMStudent.readDTO;
  public mentor!: SGMMentor.readDTO;
  public semesterKind!: SGMAccompaniment.SemesterType;
  public signature!: string | undefined;

  accompanimentsSubscription!: Subscription;
  mentorSubscription!: Subscription;
  studentSubscription!: Subscription;
  userSubscription!: Subscription;

  constructor(
    private readonly accompanimentsService: AccompanimentsService,
    private readonly mentorsService: MentorsService,
    private readonly studentsService: StudentsService,
    private readonly userService: UserService,
    private route: ActivatedRoute,
  ) {
  }

  @ViewChild('content') content!: ElementRef;

  ngOnInit(): void {
    this.semesterKind = 'sgm#secondSemester';

    let mentorIdParam = '';
    let studentIdParam = '';
    this.route.params.subscribe((params: Params) => {
        mentorIdParam = params.mentorId;
        studentIdParam = params.studentId;
      }
    );

    this.accompanimentsSubscription = this.accompanimentsService.accompanimentsStream(
      {
        orderBy:
          {timeCreated: 'asc'},
        where:
          {
            studentId: studentIdParam,
          }
      }
    ).subscribe(
      async values => this.accompaniments = await values
    );

    this.mentorSubscription = this.mentorsService.mentor(mentorIdParam).subscribe(
      async value => this.mentor = await value
    );

    this.studentSubscription = this.studentsService.studentStream(studentIdParam).subscribe(
      async value => this.student = await value
    );

    const signatureMentorId = mentorIdParam.split('-')[2];
    this.userSubscription = this.userService.signatureOf(signatureMentorId).subscribe(
      async result => this.signature = await result?.data
    );

    console.log(this.signature);

  }

  get academicPeriod() {
    if (!!this.accompaniments && this.accompaniments.length > 0)
      return this.accompaniments[0].period.name;

    return '';
  }

  public SavePDF(): void {
    const filename = `${this.student.id}.pdf`;

    const pdf = new jsPDF('l', 'mm', 'a4');

    pdf.addPage('a4');
    pdf.html(
      this.content.nativeElement, {
        html2canvas: {
          scale: 0.2,
        },
        margin: [10, 20, 10, 20],
        x: 20,
        y: 20,
        callback: pdf => {
          pdf.setFontSize(10);
          pdf.save(filename);
        }
      }
    );
  }

  public generateReport(): void {
    const input = document.getElementById('content');
    // @ts-ignore
    html2canvas(input, {useCORS: true, allowTaint: true, scrollY: 0}).then((canvas) => {
      const image = {type: 'jpeg', quality: 0.98};
      const margin = [0.5, 0.5];
      const filename = 'myfile.pdf';

      const imgWidth = 8.5;
      let pageHeight = 11;

      const innerPageWidth = imgWidth - margin[0] * 2;
      const innerPageHeight = pageHeight - margin[1] * 2;

      // Calculate the number of pages.
      const pxFullHeight = canvas.height;
      const pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      const nPages = Math.ceil(pxFullHeight / pxPageHeight);

      // Define pageHeight separately so it can be trimmed on the final page.
      pageHeight = innerPageHeight;

      // Create a one-page canvas to split up the full image.
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      // Initialize the PDF.
      const pdf = new jsPDF('p', 'in', [8.5, 11]);

      for (let page = 0; page < nPages; page++) {
        // Trim the final page to reduce file size.
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        // Display the page.
        const w = pageCanvas.width;
        const h = pageCanvas.height;
        // @ts-ignore
        pageCtx.fillStyle = 'white';
        // @ts-ignore
        pageCtx.fillRect(0, 0, w, h);
        // @ts-ignore
        pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

        // Add the page to the PDF.
        if (page > 0) pdf.addPage();
        const imgData = pageCanvas.toDataURL('image/' + image.type, image.quality);
        pdf.addImage(imgData, image.type, margin[1], margin[0], innerPageWidth, pageHeight);
      }

      pdf.save();
    });
  }

  toPdf(): void {
    const filename = `${this.student.id}.pdf`;
    const options = {
      margin: [10, 5, 10, 5] ,
      filename,
      image: { type: 'jpeg' },
      html2canvas: { scale: 0.8 },
      jsPDF: {
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        fontSize: 10
      },
      pagebreak: { mode: 'avoid-all', before: '.report-student-content' }
    };

    // @ts-ignore
    const content: Element = document.getElementById('content');

    html2pdf()
      .from(content)
      .set(options)
      .save();
  }

  ngOnDestroy() {
    // Unsubscribe
    this.accompanimentsSubscription.unsubscribe();
    this.studentSubscription.unsubscribe();
    this.mentorSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
