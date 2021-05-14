import { firestore } from "firebase/app";

export namespace SGMAccompaniment {

    export const FollowingKindOptions = ['sgm#reunion1', 'sgm#reunion2', 'sgm#reunion3', 'sgm#reunion4', 'sgm#informales'] as const;
    
    export const AllFollowingKindOptions = ['sgm#virtual', 'sgm#presencial', ...FollowingKindOptions] as const;

    export type FollowingType = typeof AllFollowingKindOptions[number];

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
        read?: boolean;

        mentor: { displayName: string; reference: firestore.DocumentReference; email: string };

        student: { displayName: string; reference: firestore.DocumentReference; email: string };

        period: { name: string; reference: firestore.DocumentReference; };

        degree: { name: string; reference: firestore.DocumentReference; };

        area: { name: string; reference: firestore.DocumentReference; };

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
        reviewKey: string;
        confirmation?: null;
        read: boolean;
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

    export function translateFollowing(condition: FollowingType): string {

        if (condition === 'sgm#presencial')
            return 'Presencial'
        if (condition === 'sgm#virtual')
            return 'Virtual'
        if (condition === 'sgm#informales')
            return 'Medios Informales'
        if (condition === 'sgm#reunion1')
            return 'Reunión 1'
        if (condition === 'sgm#reunion2')
            return 'Reunión 2'
        if (condition === 'sgm#reunion3')
            return 'Reunión 3'
        if (condition === 'sgm#reunion4')
            return 'Reunión 4'

        return `Error: ${condition}`;
    }

    export function translateQualification(condition: QualificationType): string {

        //Modificar aquí valores

        if (condition === 'sgm#1')
            return 'Insatisfactorio 😔'
        if (condition === 'sgm#2')
            return 'Poco Satisfactorio 😕'
        if (condition === 'sgm#3')
            return 'Regular 😐 '
        if (condition === 'sgm#4')
            return 'Satisfactorio 😄 '
        if (condition === 'sgm#5')
            return 'Muy Satisfactorio 😁'

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
