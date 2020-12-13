import { firestore } from "firebase";
import { SGMAcademicArea } from "./academic-area";
import { SGMAcademicDegree } from "./academic-degree";
import { SGMAcademicPeriod } from "./academic-period";
import { SGMMentor } from "./mentor";
import { SGMStudent } from "./student";

export namespace SGMAccompaniment {

    export const FollowingKindOptions = ['sgm#virtual', 'sgm#presencial'] as const;

    export type FollowingType = typeof FollowingKindOptions[number];

    export const SemesterKindOptions = ['sgm#firstSemester', 'sgm#secondSemester'] as const;

    export type SemesterType = typeof SemesterKindOptions[number];

    export const QualificationKindOptions = ['sgm#1', 'sgm#2', 'sgm#3', 'sgm#4', 'sgm#5'] as const;

    export type QualificationType = typeof QualificationKindOptions[number];

    export const AccompanimentKindOptions = ['SGM#NO_PROBLEM_ACCOMPANIMENT', 'SGM#PROBLEM_ACCOMPANIMENT'] as const;

    export type AccompanimentKind = typeof AccompanimentKindOptions[number];

    export interface Asset {
        name: string;
        path: string;
        downloadUrl: string;
    }

    interface _AnyKindAccompaniment {
        id: string;

        kind?: AccompanimentKind;

        timeCreated: firestore.Timestamp;

        mentor: { displayName: string; reference: SGMMentor.reference; email: string };

        student: { displayName: string; reference: SGMStudent.reference; email: string };

        period: { name: string; reference: SGMAcademicPeriod.reference; };

        degree: { name: string; reference: SGMAcademicDegree.reference; };

        area: { name: string; reference: SGMAcademicArea.reference; };

        semesterKind: SemesterType;

        followingKind: FollowingType;

        problems: {
            problemCount: number;

            academic: boolean;
            administrative: boolean;
            economic: boolean;
            psychosocial: boolean;
            none: boolean;

            otherDescription: string | null;
            other: boolean | null;
        };

        problemDescription?: string | null;

        solutionDescription?: string | null;

        topicDescription?: string | null;

        assets: Array<Asset>;

        important?: boolean;

        // confirmation
        timeConfirmed: firestore.Timestamp | null;

        reviewKey: string | null;

        confirmation?: {
            qualification: QualificationType;
            comment: string | null;
            digitalSignature: string;
        };
    }

    /** @deprecated */
    interface _Legacy extends _AnyKindAccompaniment {
        problemDescription: string;
        solutionDescription: string;
        topicDescription: string;
        problems: {
            problemCount: number;
            academic: boolean;
            administrative: boolean;
            economic: boolean;
            psychosocial: boolean;
            none: boolean;
            otherDescription: string;
            other: boolean;
        }
    };

    interface _ProblemBase extends _AnyKindAccompaniment {
        kind: 'SGM#PROBLEM_ACCOMPANIMENT';
        problemDescription: string;
        solutionDescription: string;
        topicDescription: null;
        problems: {
            problemCount: number;
            academic: boolean;
            administrative: boolean;
            economic: boolean;
            psychosocial: boolean;
            none: false;
            otherDescription: null;
            other: false;
        }
    };

    interface _NoProblemBase extends _AnyKindAccompaniment {
        kind: 'SGM#NO_PROBLEM_ACCOMPANIMENT';
        problemDescription: null;
        solutionDescription: null;
        topicDescription: string;
        problems: {
            problemCount: 0;
            academic: false;
            administrative: false;
            economic: false;
            psychosocial: false;
            none: true;
            otherDescription: string;
            other: true;
        }
    };

    // tslint:disable-next-line: deprecation
    type _Base = _AnyKindAccompaniment & (_Legacy | _ProblemBase | _NoProblemBase);

    export type createDTO = _Base & {
        timeCreated: firestore.FieldValue,
        timeConfirmed: null;
        reviewKey: string,
        confirmation?: null
    };

    export type readDTO = _Base & {
        timeCreated: firestore.Timestamp,
        timeConfirmed: firestore.Timestamp | null;
    };

    export interface updateConfirmationDTO {
        timeConfirmed: firestore.FieldValue;
        reviewKey: null,
        'confirmation/qualification': QualificationType,
        'confirmation/comment'?: string | null,
        'confirmation/digitalSignature': string,
    }

    export type collection = firestore.CollectionReference<_Base>

    export type reference = firestore.DocumentReference<_Base>

    export function translateFollowing(condition: FollowingType): string {

        if (condition === 'sgm#presencial')
            return 'Presencial'
        if (condition === 'sgm#virtual')
            return 'Virtual'

        return `Error: ${condition}`;
    }

    export function translateQualification(condition: QualificationType): string {

        if (condition === 'sgm#1')
            return 'Pésimo'
        if (condition === 'sgm#2')
            return 'Malo'
        if (condition === 'sgm#3')
            return 'Regular'
        if (condition === 'sgm#4')
            return 'Bueno'
        if (condition === 'sgm#5')
            return 'Excelente'

        return `Error: ${condition}`;
    }

    export function translateKind(condition: AccompanimentKind | undefined): string {

        if (condition === 'SGM#NO_PROBLEM_ACCOMPANIMENT')
            return 'Ningún Problemas'
        if (condition === 'SGM#PROBLEM_ACCOMPANIMENT')
            return 'Con Problemas'

        return 'Antiguo';
    }

    export function translateSemester(condition: SemesterType): string {

        if (condition === 'sgm#firstSemester')
            return 'Primero'
        if (condition === 'sgm#secondSemester')
            return 'Segundo'

        return `Otro: ${condition}`;
    }
}
