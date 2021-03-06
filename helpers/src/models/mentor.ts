import { firestore } from "firebase/app";
import { SGMStudent } from "./student";

export namespace SGMMentor {

    interface _Base {
        id: string;
        displayName: string;
        email: string;
        ci: string;

        /**
         * first year as a mentor
         */
        firstYear?: boolean;

        /**
         * determine if the mentor in the current period, is still working with the same students as last semester
         */
        continues?: boolean;

        period: { reference: firestore.DocumentReference; name: string; };

        area: { reference: firestore.DocumentReference; name: string; };

        degree: { reference: firestore.DocumentReference; name: string; };

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

        integrator: { id: string; displayName: string; email: string; };
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

    /**
     * @deprecated
     */
    export function fromFirestore(snapshot: firestore.DocumentSnapshot<_Base>): readDTO | null {
        if (!snapshot.exists)
            return null;

        return snapshot.data() as _Base;
    }
}
