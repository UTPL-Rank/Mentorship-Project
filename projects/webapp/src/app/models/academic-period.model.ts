import { firestore } from 'firebase/app';

export type AcademicPeriodReference = firestore.DocumentReference<AcademicPeriod>;

export type AcademicPeriods = Array<AcademicPeriod>;

export interface AcademicPeriod {
  id: string;
  name: string;
  date: firestore.Timestamp;
  current: boolean;
}
