import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMIntegrator } from '@utpl-rank/sgm-helpers';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { IBaseCsvTransformerService } from '../services/i-base-csv-transformer.service';
import { IBaseUploadDataService } from '../services/i-base-upload-data.service';
import { StringToCsvParserService } from '../services/string-to-csv-parser.service';
import { TransformCsvToIntegratorsService } from './transform-csv-to-integrators.service';
import { UploadIntegratorsService } from './upload-integrators.service';

@Component({
  selector: 'sgm-upload-integrators',
  templateUrl: './upload-integrators.component.html',
  providers: [
    { provide: IBaseCsvTransformerService, useClass: TransformCsvToIntegratorsService },
    { provide: IBaseUploadDataService, useClass: UploadIntegratorsService },
  ]
})
export class UploadIntegratorsComponent implements OnDestroy {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly stringToCsvParserService: StringToCsvParserService,
    private readonly transformerService: IBaseCsvTransformerService<SGMIntegrator.createDTO>,
    private readonly uploadService: IBaseUploadDataService<SGMIntegrator.createDTO>,
  ) { }

  private uploadSub: Subscription | null = null;

  private readonly period$: Observable<SGMAcademicPeriod.readDTO> = this.route.data.pipe(
    map(data => data.activePeriod),
    shareReplay(1),
  );

  private readonly integratorsSource$: Subject<string> = new Subject();

  public readonly integrators$ = this.integratorsSource$.asObservable().pipe(
    switchMap(rawString => combineLatest([this.stringToCsvParserService.parse$(rawString), this.period$])),
    map(([csv, period]) => csv.splice(1).map(row => [...row, period.id])),
    switchMap(csv => this.transformerService.transform$(csv)),
    shareReplay(1),
  );

  ngOnDestroy(): void {
    this.uploadSub?.unsubscribe();
  }

  save(): void {
    if (this.uploadSub) {
      alert('Espere un momento');
      return;
    }
    const saveTask = this.integrators$.pipe(
      take(1),
      switchMap(integrators => this.uploadService.upload$(integrators))
    );

    this.uploadSub = saveTask.subscribe(saved => {
      if (saved) {

        alert('Todos los docentes integradores han sido guardados.');
        this.integratorsSource$.next('');

      }
      else
        alert('Ocurrió un error al guardar los docentes integradores, vuelve a intentarlo.');

      this.uploadSub?.unsubscribe();
      this.uploadSub = null;
    });
  }

  readFile(csv: string): void {
    this.integratorsSource$.next(csv);
  }
}
