import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMMentor } from '@utpl-rank/sgm-helpers';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { IBaseCsvTransformerService } from '../../services/i-base-csv-transformer.service';
import { IBaseUploadDataService } from '../../services/i-base-upload-data.service';
import { StringToCsvParserService } from '../../services/string-to-csv-parser.service';
import { TransformCsvToMentorsService } from './transform-csv-to-mentors.service';
import { UploadMentorsService } from './upload-mentors.service';

@Component({
  selector: 'sgm-upload-mentors',
  templateUrl: './upload-mentors.component.html',
  providers: [
    { provide: IBaseCsvTransformerService, useClass: TransformCsvToMentorsService },
    { provide: IBaseUploadDataService, useClass: UploadMentorsService },
  ]
})
export class UploadMentorsComponent implements OnDestroy {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly stringToCsvParserService: StringToCsvParserService,
    private readonly transformerService: IBaseCsvTransformerService<SGMMentor.createDTO>,
    private readonly uploadService: IBaseUploadDataService<SGMMentor.createDTO>,
  ) { }

  private uploadSub: Subscription | null = null;

  private readonly period$: Observable<SGMAcademicPeriod.readDTO> = this.route.data.pipe(
    map(data => data.activePeriod),
    shareReplay(1),
  );

  private readonly mentorsSource$: Subject<string> = new Subject();

  public readonly mentors$ = this.mentorsSource$.asObservable().pipe(
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

    const saveTask = this.mentors$.pipe(
      take(1),
      switchMap(mentors => this.uploadService.upload$(mentors))
    );

    this.uploadSub = saveTask.subscribe(saved => {
      if (saved) {
        alert('Todos los mentores han sido guardados.');
        this.mentorsSource$.next('');
      }
      else
        alert('Ocurrió un error al guardar los mentores, vuelve a intentarlo.');

      this.uploadSub?.unsubscribe();
      this.uploadSub = null;
    });
  }

  readFile(csv: string): void {
    this.mentorsSource$.next(csv);
  }
}
