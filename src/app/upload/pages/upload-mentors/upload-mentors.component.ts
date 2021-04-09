import { Component, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { SGMAcademicPeriod, SGMMentor } from '@utpl-rank/sgm-helpers';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { MentorClaims } from '../../../models/user-claims';
import { IBaseCsvTransformerService } from '../../services/i-base-csv-transformer.service';
import { StringToCsvParserService } from '../../services/string-to-csv-parser.service';
import { TransformCsvToMentorsService } from './transform-csv-to-mentors.service';

@Component({
  selector: 'sgm-upload-mentors',
  templateUrl: './upload-mentors.component.html',
  providers: [
    { provide: IBaseCsvTransformerService, useClass: TransformCsvToMentorsService }
  ]
})
export class UploadMentorsComponent implements OnDestroy {
  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private readonly usersService: UserService,
    private readonly stringToCsvParserService: StringToCsvParserService,
    private readonly transformerService: IBaseCsvTransformerService<SGMMentor.createDTO>
  ) { }

  isSaving = false;

  private sub: Subscription | null = null;

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
    this.sub?.unsubscribe();
  }

  async save(): Promise<void> {
    const data = await this.mentors$.pipe(take(1)).toPromise();
    if (!data) {
      alert('Primero lee el archivo de los mentores');
      return;
    }

    if (this.isSaving) return;

    try {
      this.isSaving = true;

      const batch = this.db.firestore.batch();

      // TODO: validate a mentor is not repeated
      data.forEach(mentor => {
        // references to all the documents that will be updated when a new mentor is created
        const username = mentor.email.split('@')[0];
        const mentorRef = this.db.collection('mentors').doc(mentor.id).ref;
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
    this.mentorsSource$.next(csv);
  }
}
