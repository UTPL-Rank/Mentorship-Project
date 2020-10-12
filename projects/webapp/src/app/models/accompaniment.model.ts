import { firestore } from 'firebase/app';
import { AcademicAreaReference } from './academic-area.model';
import { FirestoreAcademicDegreeReference } from './academic-degree.model';
import { AcademicPeriodReference } from './academic-period.model';
import { Mentor, MentorReference } from './mentor.model';
import { Student, StudentReference } from './student.model';

export type FollowingKind = 'sgm#virtual' | 'sgm#presencial';
export type SemesterKind = 'sgm#firstSemester' | 'sgm#secondSemester';
export type QualificationKind = 'sgm#1' | 'sgm#2' | 'sgm#3' | 'sgm#4' | 'sgm#5';

export type FirestoreAccompanimentReference = firestore.DocumentReference<BaseAccompaniment>;

export type FirestoreAccompaniments = Array<BaseAccompaniment>;

export type Accompaniment = BaseAccompaniment & { timeCreated: firestore.Timestamp; };
export type CreateFirestoreAccompaniment = BaseAccompaniment & { timeCreated: firestore.FieldValue };



interface BaseAccompaniment {
  id: string;

  mentor: Mentor & { reference: MentorReference; };

  student: Student & { reference: StudentReference; };

  period: {
    reference: AcademicPeriodReference;
    name: string;
    date: firestore.Timestamp
  };

  degree: {
    reference: FirestoreAcademicDegreeReference;
    name: string;
  };

  area: {
    reference: AcademicAreaReference;
    name: string;
  };

  // accompaniment data
  semesterKind: SemesterKind;
  followingKind: FollowingKind;

  problems: FirestoreAccompanimentProblems;
  problemDescription: string;
  solutionDescription: string;
  topicDescription: string;

  assets: AccompanimentAssets;

  important: boolean;

  // confirmation
  timeConfirmed?: firestore.Timestamp;
  reviewKey?: string;
  confirmation?: {
    qualification: QualificationKind;
    comment?: string;
    digitalSignature: string;
  };
}



export interface FirestoreAccompanimentProblems {
  problemCount: number;
  academic: boolean;
  administrative: boolean;
  economic: boolean;
  psychosocial: boolean;
  other: boolean;
  none: boolean;
  otherDescription: string;
}

export interface AccompanimentAsset {
  name: string;
  path: string;
  downloadUrl: string;
}

export type AccompanimentAssets = Array<AccompanimentAsset>;
