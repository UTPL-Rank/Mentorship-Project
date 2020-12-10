import { firestore } from "firebase";
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
            lastAccompaniment: firestore.Timestamp | null;
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
        'stats/assignedStudentCount'?: firestore.FieldValue;
        'stats/accompanimentsCount'?: firestore.FieldValue;
        'stats/lastAccompaniment'?: firestore.FieldValue;
        'students/withAccompaniments'?: firestore.FieldValue;
        'students/withoutAccompaniments'?: firestore.FieldValue;
        'students/degrees'?: firestore.FieldValue;
        'students/cycles'?: firestore.FieldValue;
    }

    export type reference = firestore.DocumentReference<_Base>;

    export function fromFirestore(snapshot: firestore.DocumentSnapshot<_Base>): readDTO | null {
        if (!snapshot.exists)
            return null;

        return snapshot.data() as _Base;
    }
}
