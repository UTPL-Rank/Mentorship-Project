import { firestore } from "firebase/app";

export namespace SGMAcademicDegree {

    interface _base {
        id: string;
        name: string;
        area: {
            reference: firestore.DocumentReference;
            name: string
        };
    }

    export type readDTO = _base;

}