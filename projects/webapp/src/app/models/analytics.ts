import { firestore } from 'firebase';


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
export namespace Analytics {
  interface BaseAnalytic {
    period: { name: string; reference: firestore.DocumentReference; };
    lastUpdated: firestore.Timestamp;
  }

  export interface MentorAnalytics extends BaseAnalytic {
    mentors: Array<Mentor>;
  }

  export interface Mentor {
    accompanimentsCount: number;

    assignedStudentsCount: number;

    area: { name: string; id: string; };

    degree: { name: string; id: string; };

    id: string;

    competedFinalEvaluation: string;

    mentorCycles: Array<string>;

    withAccompaniments: number;

    withoutAccompaniments: number;
  }
}
