import { Component, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMIntegrator } from '@utpl-rank/sgm-helpers';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { MentorClaims } from 'src/app/models/user-claims';
import { IBaseCsvTransformerService } from '../services/i-base-csv-transformer.service';
import { StringToCsvParserService } from '../services/string-to-csv-parser.service';
import { TransformCsvToIntegratorsService } from "./transform-csv-to-integrators.service";

@Component({
  selector: 'sgm-upload-integrators',
  templateUrl: './upload-integrators.component.html',
  providers: [
    { provide: IBaseCsvTransformerService, useClass: TransformCsvToIntegratorsService }
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
    const data = await this.integrators$.pipe(take(1)).toPromise();
    if (!data) {
      alert('Primero lee el archivo de los mentores');
      return;
    }

    if (this.isSaving) return;

    try {
      this.isSaving = true;
      const batch = this.afFirestore.firestore.batch();

      // TODO: validate a mentor is not repeated
      data.forEach(mentor => {
        // references to all the documents that will be updated when a new mentor is created
        const username = mentor.email.split('@')[0];
        const mentorRef = this.afFirestore.collection('mentors').doc(mentor.id).ref;
        const claimsRef = this.usersService.claimsDocument(username).ref;

        // data to be uploaded
        const claims: MentorClaims = { isMentor: true, mentorId: mentor.id };

        // batch writes
        // TODO: add type validation
        batch.set(mentorRef, mentor);
        batch.set(claimsRef, claims, { merge: true });
      });


      await batch.commit();
      alert('Todos los mentores han sido guardados.');
      // this.router.navigateByUrl('/panel-control');
    } catch (error) {
      this.isSaving = false;
      console.log(error);
      alert('Ocurrió un error al guardar los mentores, vuelve a intentarlo.');
    }
  }

  readFile(csv: string): void {
    this.integratorsSource$.next(csv);
  }
}
