import { firestore } from 'firebase/app';
import { FirestoreAcademicAreaReference } from './academic-area.model';
import { FirestoreAcademicDegreeReference } from './academic-degree.model';
import { AcademicPeriodReference } from './academic-period.model';
import { MentorReference } from './mentor.model';

export type AcademicCycleKind = 'sgm#first' | 'sgm#second' | 'sgm#third';

export type StudentReference = firestore.DocumentReference<Student>;

export type Students = Array<Student>;

export interface Student {
  id: string;
  displayName: string;
  email: string;
  cycle: AcademicCycleKind;

  area: {
    reference: FirestoreAcademicAreaReference;
    name: string;
  };

  degree: {
    reference: FirestoreAcademicDegreeReference;
    name: string;
  };

  period: {
    reference: AcademicPeriodReference;
    name: string;
    date: firestore.Timestamp
  };

  mentor: {
    reference: MentorReference;
    displayName: string;
    email: string;
  };

  stats: {
    accompanimentsCount: number;
    lastAccompaniment?: firestore.Timestamp;
  }
}
