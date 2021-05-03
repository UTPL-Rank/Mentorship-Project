import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { SGMAcademicArea } from '@utpl-rank/sgm-helpers';

@Injectable({ providedIn: 'root' })
export class AcademicAreasService {
  constructor(
    private readonly db: AngularFirestore,
    private readonly perf: AngularFirePerformance
  ) { }

  public getAreasCollection(): AngularFirestoreCollection<SGMAcademicArea.readDTO> {
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    console.log('TODO: remove this');
    return this.db.collection<SGMAcademicArea.readDTO>('academic-areas');
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
}
