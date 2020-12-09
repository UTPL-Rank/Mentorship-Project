import firebase from 'firebase/app';

export namespace SGMNotification {

    interface base {
        id: string;
        message: string;
        name: string;
        redirect: string;
        read: boolean;
        time: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
    }


    export interface readDTO extends base {
        time: firebase.firestore.Timestamp;
    }

    export interface createDTO extends base {
        time: firebase.firestore.FieldValue;
    }

    export interface updateDTO {
        read: true;
    }

    export type collection = firebase.firestore.CollectionReference<base>
    export type reference = firebase.firestore.DocumentReference<base>
}
