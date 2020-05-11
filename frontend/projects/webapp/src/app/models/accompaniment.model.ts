import { firestore } from 'firebase/app';
import { FirestoreAcademicAreaReference } from './academic-area.model';
import { FirestoreAcademicDegreeReference } from './academic-degree.model';
import { AcademicPeriodReference } from './academic-period.model';
import { Mentor, MentorReference } from './mentor.model';
import { Student, StudentReference } from './student.model';

export type FollowingKind = 'sgm#virtual' | 'sgm#presencial';
export type SemesterKind = 'sgm#firstSemester' | 'sgm#secondSemester';
export type QualificationKind = 'sgm#1' | 'sgm#2' | 'sgm#3' | 'sgm#4' | 'sgm#5';

export type FirestoreAccompanimentReference = firestore.DocumentReference<FirestoreAccompaniment>;

export type FirestoreAccompaniments = Array<FirestoreAccompaniment>;

export type FirestoreAccompaniment = Accompaniment & { timeCreated: firestore.Timestamp; };
export type CreateFirestoreAccompaniment = Accompaniment & { timeCreated: firestore.FieldValue };



interface Accompaniment {
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
    reference: FirestoreAcademicAreaReference;
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
  otherDescription: string;
}

export interface AccompanimentAsset {
  name: string;
  path: string;
  downloadUrl: string;
}

export type AccompanimentAssets = Array<AccompanimentAsset>;
