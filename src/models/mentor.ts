import firebase from 'firebase/app';
import { SGMAcademicArea } from "./academic-area";
import { SGMAcademicDegree } from "./academic-degree";
import { SGMAcademicPeriod } from "./academic-period";
import { SGMStudent } from "./student";

export namespace SGMMentor {

    interface _Base {
        id: string;
        displayName: string;
        email: string;
        ci: string;

        period: { reference: SGMAcademicPeriod.reference; name: string; };

        area: { reference: SGMAcademicArea.reference; name: string; };

        degree: { reference: SGMAcademicDegree.reference; name: string; };

        stats: {
            assignedStudentCount: number;
            accompanimentsCount: number;
            lastAccompaniment: firebase.firestore.Timestamp | null;
        };

        students: {
            withAccompaniments: Array<string>;
            withoutAccompaniments: Array<string>;
            degrees: Array<string>;
            cycles: Array<SGMStudent.AcademicCycle>;
        };
    }

    export type readDTO = _Base;

    export interface createDTO extends _Base {
        stats: {
            assignedStudentCount: 0;
            accompanimentsCount: 0;
            lastAccompaniment: null;
        };

        students: {
            withAccompaniments: [];
            withoutAccompaniments: [];
            degrees: [];
            cycles: [];
        };
    }

    export interface updateDTO extends Partial<_Base> {
        'stats/assignedStudentCount'?: firebase.firestore.FieldValue;
        'stats/accompanimentsCount'?: firebase.firestore.FieldValue;
        'stats/lastAccompaniment'?: firebase.firestore.FieldValue;
        'students/withAccompaniments'?: firebase.firestore.FieldValue;
        'students/withoutAccompaniments'?: firebase.firestore.FieldValue;
        'students/degrees'?: firebase.firestore.FieldValue;
        'students/cycles'?: firebase.firestore.FieldValue;
    }

    export type reference = firebase.firestore.DocumentReference<_Base>;

    export function fromFirestore(snapshot: firebase.firestore.DocumentSnapshot<_Base>): readDTO | null {
        if (!snapshot.exists)
            return null;

        return snapshot.data() as _Base;
    }
}
