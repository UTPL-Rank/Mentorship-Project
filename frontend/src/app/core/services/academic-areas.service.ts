import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { SGMAcademicArea } from '@utpl-rank/sgm-helpers';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';
import {map, mergeMap, shareReplay} from 'rxjs/operators';

const AREAS_COLLECTION_NAME = 'academic-areas';


@Injectable({ providedIn: 'root' })
export class AcademicAreasService {
  constructor(
    private readonly db: AngularFirestore,
    private readonly perf: AngularFirePerformance
  ) { }

  public getAreasCollection(): AngularFirestoreCollection<SGMAcademicArea.readDTO> {
    return this.db.collection<SGMAcademicArea.readDTO>(AREAS_COLLECTION_NAME);
  }

  public getAreasCollectionReference(): CollectionReference {
    return this.getAreasCollection().ref;
  }

  public getAreaDocument(areaId: string): AngularFirestoreDocument<SGMAcademicArea.readDTO> {
    return this.getAreasCollection().doc<SGMAcademicArea.readDTO>(areaId);
  }

  public getAreaDocumentReference(areaId: string): DocumentReference {
    return this.getAreaDocument(areaId).ref;
  }

  public areaRef(areaId: string): firestore.DocumentReference<SGMAcademicArea.readDTO> {
    return this.getAreasCollection().doc(areaId).ref as firestore.DocumentReference<SGMAcademicArea.readDTO>;
  }

  /**
   * Get areas
   */
  public getAreas(): Observable<Array<SGMAcademicArea.readDTO>> {
    return this.getAreasCollection()
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.perf.trace('list-all-areas');
          return doc;
        }),
        shareReplay(1),
        map(areas => [...areas]),
      );
  }

  /**
   * get information about an specific area
   * @param areaId identifier of requested degree
   */
  public areaStream(areaId: string): Observable<SGMAcademicArea.readDTO | null> {
    return this.getAreaDocument(areaId)
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.perf.trace('load-area-information');
          return doc ?? null;
        }),
        shareReplay(1)
      );
  }

}
