import { firestore } from "firebase/app";

export namespace SGMNotification {

    interface base {
        id: string;
        message: string;
        name: string;
        redirect: string;
        read: boolean;
        time: firestore.Timestamp | firestore.FieldValue;
    }


    export interface readDTO extends base {
        time: firestore.Timestamp;
    }

    export interface createDTO extends base {
        time: firestore.FieldValue;
    }

    export interface updateDTO {
        read: true;
    }

}
