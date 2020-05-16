import { firestore } from 'firebase/app';
import { AcademicAreaReference } from './academic-area.model';
import { FirestoreAcademicDegreeReference } from './academic-degree.model';
import { AcademicPeriodReference } from './academic-period.model';

export type MentorReference = firestore.DocumentReference<Mentor>;
export type MentorQuery = firestore.Query<Mentor>;

export type Mentors = Array<Mentor>;

export interface Mentor {
  id: string;
  displayName: string;
  email: string;
  ci: string;

  period: {
    reference: AcademicPeriodReference;
    name: string;
    date: firestore.Timestamp
  };

  area: {
    reference: AcademicAreaReference;
    name: string;
  };

  degree: {
    reference: FirestoreAcademicDegreeReference;
    name: string;
  };

  stats: {
    assignedStudentCount: number;
    accompanimentsCount: number;
    lastAccompaniment?: firestore.Timestamp;
  };
}

export interface IncrementStudentCounterFirestoreMentor {
  stats: {
    assignedStudentCount: firestore.FieldValue;
  };
}

export interface IncrementAccompanimentCounterFirestoreMentor {
  stats: {
    accompanimentsCount: firestore.FieldValue;
    lastAccompaniment: firestore.FieldValue;
  };
}
