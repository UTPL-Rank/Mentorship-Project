import { Component, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMIntegrator } from '@utpl-rank/sgm-helpers';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { IntegratorClaims } from 'src/app/models/user-claims';
import { IBaseCsvTransformerService } from '../services/i-base-csv-transformer.service';
import { StringToCsvParserService } from '../services/string-to-csv-parser.service';
import { TransformCsvToIntegratorsService } from './transform-csv-to-integrators.service';

@Component({
  selector: 'sgm-upload-integrators',
  templateUrl: './upload-integrators.component.html',
  providers: [
    { provide: IBaseCsvTransformerService, useClass: TransformCsvToIntegratorsService },
  ]
})
export class UploadIntegratorsComponent implements OnDestroy {

  constructor(
    private readonly afFirestore: AngularFirestore,
    private readonly route: ActivatedRoute,
    private readonly usersService: UserService,
    private readonly stringToCsvParserService: StringToCsvParserService,
    private readonly transformerService: IBaseCsvTransformerService<SGMIntegrator.createDTO>,
  ) { }

  isSaving = false;

  private sub: Subscription | null = null;

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
    this.sub?.unsubscribe();
  }

  async save(): Promise<void> {
    const integrators = await this.integrators$.pipe(take(1)).toPromise();
    if (!integrators) {
      alert('Primero lee el archivo de los mentores');
      return;
    }

    if (this.isSaving) return;

    try {
      this.isSaving = true;
      const batch = this.afFirestore.firestore.batch();

      // TODO: validate a integrators is not repeated
      integrators.forEach(integrator => {
        // references to all the documents that will be updated when a new integrator is created
        const username = integrator.email.split('@')[0];
        const integratorRef = this.afFirestore.collection('integrators').doc(integrator.id).ref;
        const claimsRef = this.usersService.claimsDocument(username).ref;

        // data to be uploaded
        const claims: IntegratorClaims = { isIntegrator: true, integratorId: integrator.id };

        // batch writes
        // TODO: add type validation
        batch.set(integratorRef, integrator);
        batch.set(claimsRef, claims, { merge: true });
      });


      await batch.commit();
      alert('Todos los docentes integradores han sido guardados.');
      // this.router.navigateByUrl('/panel-control');
    } catch (error) {
      this.isSaving = false;
      console.log(error);
      alert('Ocurrió un error al guardar los docentes integradores, vuelve a intentarlo.');
    }
  }

  readFile(csv: string): void {
    this.integratorsSource$.next(csv);
  }
}
