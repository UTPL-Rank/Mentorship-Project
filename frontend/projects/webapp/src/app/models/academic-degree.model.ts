import { firestore } from 'firebase/app';
import { AcademicAreaReference } from './models';

export type FirestoreAcademicDegreeReference = firestore.DocumentReference<FirestoreAcademicDegree>;

export type FirestoreAcademicDegrees = Array<FirestoreAcademicDegree>;

export interface FirestoreAcademicDegree {
  id: string;
  name: string;
  area: {
    reference: AcademicAreaReference;
    name: string
  };
}
