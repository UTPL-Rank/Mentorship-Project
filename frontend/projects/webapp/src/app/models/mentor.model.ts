import { firestore } from 'firebase/app';
import { AcademicAreaReference } from './academic-area.model';
import { FirestoreAcademicDegreeReference } from './academic-degree.model';
import { AcademicPeriodReference } from './academic-period.model';
import { AcademicCycleKind } from './models';

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

  students: {
    withAccompaniments: Array<string>;
    withoutAccompaniments: Array<string>;
    degrees: Array<string>;
    cycles: Array<AcademicCycleKind>;
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


export interface MentorEvaluationDetails {
  mentorFirstTime?: boolean;
  principalProblems?: string;
  studentsWithoutAccompaniments?: string;
}

export interface MentorEvaluationActivities {
  meetings?: string;
  sports?: string;
  academicEvent?: string;
  socialEvent?: string;
  virtualAccompaniment?: string;
  other?: string;
}

export interface MentorEvaluationDependencies {
  coordinator?: string;
  teachers?: string;
  missions?: string;
  chancellor?: string;
  library?: string;
  firstSolvedByMentor?: string;
  otherServices?: string;
  other?: string;
}

export interface MentorEvaluationObservations {
  positives?: string;
  inconveniences?: string;
  suggestions?: string;
  other?: string;
}
