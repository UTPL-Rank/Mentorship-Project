import { firestore } from "firebase/app";

export namespace SGMCoordinator {

    interface _Base {
        id: string;
        displayName: string;
        email: string;

        period: { reference: firestore.DocumentReference; name: string; };

        assignedMentorsCount: number | firestore.FieldValue;
    }

    export interface readDTO extends _Base {
        assignedMentorsCount: number;
    }

    export interface createDTO extends _Base {
        assignedMentorsCount: 0;
    }

    export interface updateMentorsCountDTO extends Pick<_Base, 'assignedMentorsCount'> {
        assignedMentorsCount: firestore.FieldValue;
    }

    export namespace functions { }
}
