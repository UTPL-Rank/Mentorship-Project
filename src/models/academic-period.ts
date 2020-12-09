import firebase from "firebase/app";

export namespace SGMAcademicPeriod {

    interface base {
        id: string;
        name: string;
        date: firebase.firestore.Timestamp;
        current: boolean;
    }

    export type reference = firebase.firestore.DocumentReference<base>;

    export type readDTO = base;

}