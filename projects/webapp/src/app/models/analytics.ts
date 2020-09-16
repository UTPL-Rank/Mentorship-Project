import { firestore } from 'firebase';

interface BaseAnalytic {
  lastUpdated: firestore.Timestamp;
  period: {
    name: string;
    reference: firestore.DocumentReference;
  }
}

// tslint:disable-next-line: no-namespace
export namespace AccompanimentsAnalytics {

  interface StudentEntry {

  }

  interface AreaCount {
    name: string;
    reference: firestore.DocumentReference;
    withAccompaniments: Array<StudentEntry>;
  }

  interface AccompanimentsCount {
    administrativa: AreaCount;
  }
}


// tslint:disable-next-line: no-namespace
export namespace MentorAnalytics {
  export interface Analytics extends BaseAnalytic {
    mentors: Array<MentorEntry>;
  }

  interface MentorEntry {
    displayName: string;
    id: string;

    competedFinalEvaluation: string;


    mentorCycles: Array<string>;

    degree: {
      name: string;
      id: string;
    };

    area: {
      name: string;
      id: string;
    };

    stats: {
      accompanimentsCount: number;
      assignedStudentsCount: number;
      lastAccompaniments: firestore.Timestamp;
    }

    students: {
      cycles: Array<string>;
      studentsDegrees: Array<string>;
      withAccompaniments: number;
      withoutAccompaniments: number;
    }
  }


}
