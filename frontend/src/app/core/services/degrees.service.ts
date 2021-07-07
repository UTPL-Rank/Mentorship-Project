import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirePerformance } from '@angular/fire/performance';
import { SGMAcademicDegree } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AcademicPeriodsService } from './academic-periods.service';
import { ReportsService } from './reports.service';

const DEGREES_COLLECTION_NAME = 'academic-degrees';

@Injectable({ providedIn: 'root' })
export class DegreesService {
  constructor(
    private readonly angularFirestore: AngularFirestore,
    private readonly functions: AngularFireFunctions,
    private readonly perf: AngularFirePerformance,
    private readonly periodsService: AcademicPeriodsService,
    private readonly reportsService: ReportsService,
  ) { }

  public getDegreesCollection(): AngularFirestoreCollection<SGMAcademicDegree.readDTO> {

      return this.angularFirestore.collection<SGMAcademicDegree.readDTO>(DEGREES_COLLECTION_NAME);
  }

  /**
   * Get degrees
   */
  public getAllDegrees(): Observable<Array<SGMAcademicDegree.readDTO>> {
    return this.getDegreesCollection()
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.perf.trace('list-all-degrees');
          return doc;
        }),
        shareReplay(1),
        map(degrees => [...degrees]),
      );
  }

  private degreeDocument(degreeId: string): AngularFirestoreDocument<SGMAcademicDegree.readDTO> {
    return this.getDegreesCollection().doc(degreeId);
  }

  public degree(degreeId: string): Observable<SGMAcademicDegree.readDTO> {
    return this.getDegreesCollection().doc(degreeId).get().pipe(
      map(snap => (snap.data() as SGMAcademicDegree.readDTO))
    );
  }

  public degreeRef(degreeId: string): firestore.DocumentReference<SGMAcademicDegree.readDTO> {
    return this.getDegreesCollection().doc(degreeId).ref as firestore.DocumentReference<SGMAcademicDegree.readDTO>;
  }

  /**
   * get information about an specific degree
   * @param degreeId identifier of requested degree
   */
  public degreeStream(degreeId: string): Observable<SGMAcademicDegree.readDTO | null> {
    return this.degreeDocument(degreeId)
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.perf.trace('load-degree-information');
          return doc ?? null;
        }),
        shareReplay(1)
      );
  }

}
