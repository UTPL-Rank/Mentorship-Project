import { SGMAccompaniment } from "./accompaniments";
import { SGMStudent } from "./student";

export namespace SGMAnalytics {

    export interface AnalyticsPeriod {
        id: string;
        name: string;
    }

    interface _Base {
        id: string;
        lastUpdated: string;
        period: AnalyticsPeriod
    }

    /**
     * Accompaniments Analytics
     */
    interface _BaseAccompanimentEntry {
        area: { name: string; id: string; },
        period: { name: string; id: string; },
        degree: { name: string; id: string; },
        mentor: { displayName: string; id: string; },
        student: { displayName: string; id: string; },
        kind: SGMAccompaniment.AccompanimentKind | null;
        followingKind: SGMAccompaniment.FollowingType;
        important: boolean;
        id: string;
        problems: {
            academic: boolean;
            administrative: boolean;
            economic: boolean;
            psychosocial: boolean;
            none: boolean;
            other: boolean | null;
        };
        reviewed: boolean;
        semesterKind: SGMAccompaniment.SemesterType,
    }

    export interface LegacyAccompanimentEntry extends _BaseAccompanimentEntry {
        kind: null,
        problems: {
            problemCount: number;
            academic: boolean;
            administrative: boolean;
            economic: boolean;
            psychosocial: boolean;
            none: boolean;
            other: boolean;
        }
    }
    export interface ProblemAccompanimentEntry extends _BaseAccompanimentEntry {
        kind: 'SGM#PROBLEM_ACCOMPANIMENT';
        problems: {
            problemCount: number;
            academic: boolean;
            administrative: boolean;
            economic: boolean;
            psychosocial: boolean;
            none: false;
            other: false;
        }
    }
    export interface NoProblemAccompanimentEntry extends _BaseAccompanimentEntry {
        kind: 'SGM#NO_PROBLEM_ACCOMPANIMENT';
        problems: {
            problemCount: 0;
            academic: false;
            administrative: false;
            economic: false;
            psychosocial: false;
            none: true;
            other: true;
        }
    }

    export interface AccompanimentsAnalytics extends _Base {
        accompaniments?: Array<LegacyAccompanimentEntry | ProblemAccompanimentEntry | NoProblemAccompanimentEntry>;
    }

    /**
     * Student Analytics
     */
    export interface StudentEntry {
        area: { name: string; id: string; },
        period: { name: string; id: string; },
        degree: { name: string; id: string; },
        id: string;
        displayName: string;
        mentor: { displayName: string; id: string; },
        accompanimentsCount: number;
        cycle: SGMStudent.AcademicCycle;
        /** determinate if it is not the first semester as a mentored student */
        continues?: boolean;
    }

    export interface StudentsAnalytics extends _Base {
        students?: Array<StudentEntry>;
    }

    /**
     * Mentors Analytics
     */
    export interface MentorEntry {
        id: string;
        displayName: string;
        area: { name: string; id: string; },
        degree: { name: string; id: string; },
        period: { name: string; id: string; },
        /** first year as a mentor */
        firstYear?: boolean;
        /** determine if the mentor in the current period, is still working with the same students as last semester */
        continues?: boolean;
        accompanimentsCount: number;
        assignedStudentCount: number;
        withAccompaniments: number;
        withoutAccompaniments: number;
    }

    export interface MentorsAnalytics extends _Base {
        mentors?: Array<MentorEntry>;
    }
}