import { firestore } from 'firebase/app';

export type AreasIds = 'administrativa' | 'biologica' | 'sociohumanistica' | 'tecnica';

export type FirestoreAcademicAreaReference = firestore.DocumentReference<FirestoreAcademicArea>;

export type FirestoreAcademicAreas = Array<FirestoreAcademicArea>;

export interface FirestoreAcademicArea {
  id: AreasIds;
  name: string;
}
