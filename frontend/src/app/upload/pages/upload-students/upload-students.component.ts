import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMStudent } from '@utpl-rank/sgm-helpers';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { IBaseCsvTransformerService } from '../../services/i-base-csv-transformer.service';
import { IBaseUploadDataService } from '../../services/i-base-upload-data.service';
import { StringToCsvParserService } from '../../services/string-to-csv-parser.service';
import { TransformCsvToStudentsService } from "./transform-csv-to-students.service";
import { UploadStudentsService } from "./upload-students.service";
@Component({
  selector: 'sgm-upload-students',
  templateUrl: './upload-students.component.html',
  providers: [
    { provide: IBaseCsvTransformerService, useClass: TransformCsvToStudentsService },
    { provide: IBaseUploadDataService, useClass: UploadStudentsService },
  ]
})
export class UploadStudentsComponent implements OnDestroy {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly stringToCsvParserService: StringToCsvParserService,
    private readonly transformerService: IBaseCsvTransformerService<SGMStudent.createDTO>,
    private readonly uploadService: IBaseUploadDataService<SGMStudent.createDTO>,
  ) { }

  private uploadSub: Subscription | null = null;

  private readonly period$: Observable<SGMAcademicPeriod.readDTO> = this.route.data.pipe(
    map(data => data.activePeriod),
    shareReplay(1),
  );

  private readonly studentsSource$: Subject<string> = new Subject();

  public readonly students$ = this.studentsSource$.asObservable().pipe(
    switchMap(rawString => combineLatest([this.stringToCsvParserService.parse$(rawString), this.period$])),
    map(([csv, period]) => csv.splice(1).map(row => [...row, period.id])),
    switchMap(csv => this.transformerService.transform$(csv)),
    shareReplay(1),
  );

  ngOnDestroy(): void {
    this.uploadSub?.unsubscribe();
  }

  async save(): Promise<void> {
    if (this.uploadSub) {
      alert('Espere un momento');
      return;
    }

    const saveTask = this.students$.pipe(
      take(1),
      switchMap(students => this.uploadService.upload$(students))
    );

    this.uploadSub = saveTask.subscribe(saved => {
      if (saved) {
        alert('Todos los estudiantes han sido guardados.');
        this.studentsSource$.next('');
      } else
        alert('Ocurrió un error al guardar los estudiantes, vuelve a intentarlo.');

      this.uploadSub?.unsubscribe();
      this.uploadSub = null;
    });
  }

  readFile(csv: string): void {
    this.studentsSource$.next(csv);
  }
}
