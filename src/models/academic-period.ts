import { firestore } from "firebase/app";

export namespace SGMAcademicPeriod {

    interface base {
        id: string;
        name: string;
        date: firestore.Timestamp;
        current: boolean;
    }

    export type readDTO = base;

}