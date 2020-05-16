import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { AcademicArea } from '../../models/academic-area.model';

const ACADEMIC_AREAS_COLLECTION_NAME = 'mentors';

@Injectable({ providedIn: 'root' })
export class AcademicAreasService {
  constructor(
    private readonly db: AngularFirestore,
    private readonly perf: AngularFirePerformance
  ) { }

  public getAreasCollection(): AngularFirestoreCollection<AcademicArea> {
    return this.db.collection<AcademicArea>(ACADEMIC_AREAS_COLLECTION_NAME);
  }

  public getAreasCollectionReference(): CollectionReference {
    return this.getAreasCollection().ref;
  }

  public getAreaDocument(areaId: string): AngularFirestoreDocument<AcademicArea> {
    return this.getAreasCollection().doc<AcademicArea>(areaId);
  }

  public getAreaDocumentReference(areaId: string): DocumentReference {
    return this.getAreaDocument(areaId).ref;
  }
}
