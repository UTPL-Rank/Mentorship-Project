import { firestore } from 'firebase/app';

export type AreasIds = 'administrativa' | 'biologica' | 'sociohumanistica' | 'tecnica';

export type AcademicAreaReference = firestore.DocumentReference<AcademicArea>;

export type AcademicAreas = Array<AcademicArea>;

export interface AcademicArea {
  id: AreasIds;
  name: string;
}
