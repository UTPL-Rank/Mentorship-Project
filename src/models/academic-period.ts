import { firestore } from "firebase";

export namespace SGMAcademicPeriod {

    interface base {
        id: string;
        name: string;
        date: firestore.Timestamp;
        current: boolean;
    }

    export type reference = firestore.DocumentReference<base>;

    export type readDTO = base;

}