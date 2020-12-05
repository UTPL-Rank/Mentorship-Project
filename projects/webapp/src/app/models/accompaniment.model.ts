import { firestore } from 'firebase/app';
import { AcademicAreaReference } from './academic-area.model';
import { FirestoreAcademicDegreeReference } from './academic-degree.model';
import { AcademicPeriodReference } from './academic-period.model';
import { Mentor, MentorReference } from './mentor.model';
import { Student, StudentReference } from './student.model';

export type FollowingKind = 'sgm#virtual' | 'sgm#presencial';
export type SemesterKind = 'sgm#firstSemester' | 'sgm#secondSemester';
export type QualificationKind = 'sgm#1' | 'sgm#2' | 'sgm#3' | 'sgm#4' | 'sgm#5';
export interface AccompanimentAsset {
  name: string;
  path: string;
  downloadUrl: string;
}


export type ICreateAccompaniment = IBaseAccompaniment
  & { timeCreated: firestore.FieldValue }
  & (IProblemAccompaniment | INoProblemAccompaniment);

export type IAccompaniment = IBaseAccompaniment
  & { timeCreated: firestore.FieldValue }
  & (IProblemAccompaniment | INoProblemAccompaniment);

type IProblemAccompaniment = IBaseAccompaniment & {
  kind: 'SGM#PROBLEM_ACCOMPANIMENT';
  problemDescription: string;
  solutionDescription: string;
  topic: null;
  topicDescription: null;
  problems: {
    problemCount: number;
    academic: boolean;
    administrative: boolean;
    economic: boolean;
    psychosocial: boolean;
    none: false;
  }
};

type INoProblemAccompaniment = IBaseAccompaniment & {
  kind: 'SGM#NO_PROBLEM_ACCOMPANIMENT';
  problemDescription: null;
  solutionDescription: null;
  topic: string;
  topicDescription: string;
  problems: {
    problemCount: 0;
    academic: false;
    administrative: false;
    economic: false;
    psychosocial: false;
    none: true;
  }
};


interface IBaseAccompaniment {
  id: string;

  kind: 'SGM#NO_PROBLEM_ACCOMPANIMENT' | 'SGM#PROBLEM_ACCOMPANIMENT';

  timeCreated: firestore.Timestamp | firestore.FieldValue;

  mentor: { displayName: string; reference: MentorReference; };

  student: { displayName: string; reference: StudentReference; };

  period: { name: string; reference: AcademicPeriodReference; };

  degree: { name: string; reference: FirestoreAcademicDegreeReference; };

  area: { name: string; reference: AcademicAreaReference; };

  // accompaniment data
  semesterKind: SemesterKind;
  followingKind: FollowingKind;
  problems: {
    problemCount: number;

    academic: boolean;
    administrative: boolean;
    economic: boolean;
    psychosocial: boolean;
    none: boolean;

    /** @deprecated */
    otherDescription: string;
    /** @deprecated */
    other: boolean;
  };

  problemDescription?: string;
  solutionDescription?: string;

  topic?: string;
  topicDescription?: string;

  assets: Array<AccompanimentAsset>;

  important?: boolean;

  // confirmation
  timeConfirmed: firestore.Timestamp | null;
  reviewKey: string | null;
  confirmation?: {
    qualification: QualificationKind;
    comment: string | null;
    digitalSignature: string;
  };
}

/** @deprecated */
export type FirestoreAccompanimentReference = firestore.DocumentReference<BaseAccompaniment>;

/** @deprecated */
export type FirestoreAccompaniments = Array<BaseAccompaniment>;

/** @deprecated */
export type Accompaniment = BaseAccompaniment & { timeCreated: firestore.Timestamp; };
/** @deprecated */
export type CreateFirestoreAccompaniment = BaseAccompaniment & { timeCreated: firestore.FieldValue };

/** @deprecated */
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


/** @deprecated */
export interface FirestoreAccompanimentProblems {
  problemCount: number;
  academic: boolean;
  administrative: boolean;
  economic: boolean;
  psychosocial: boolean;
  otherDescription: string;
  other: boolean;
  none: boolean;
}



/** @deprecated */
export type AccompanimentAssets = Array<AccompanimentAsset>;
