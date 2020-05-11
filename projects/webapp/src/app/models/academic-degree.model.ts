import { firestore } from 'firebase/app';
import { FirestoreAcademicAreaReference } from './academic-area.model';

export type FirestoreAcademicDegreeReference = firestore.DocumentReference<FirestoreAcademicDegree>;

export type FirestoreAcademicDegrees = Array<FirestoreAcademicDegree>;

export interface FirestoreAcademicDegree {
  id: string;
  name: string;
  area: {
    reference: FirestoreAcademicAreaReference;
    name: string
  };
}
