import * as firebaseAdmin from "firebase-admin";

export namespace SGMUser {
    interface _Base {
        username?: string;
        disabled: boolean;
        displayName: string;
        email: string;
        photoURL: string | null;
        uid: string;
        notificationTopics?: Array<string> | firebaseAdmin.firestore.FieldValue;
    }

    /**
     * Get the information of any user in the platform
     */
    export interface readDto extends _Base {
        notificationTopics?: Array<string>;
    }

    export module functions {
        export interface createDto extends _Base {
            notificationTopics: [];
            username: string;
            disabled: false;
        }

        export interface addTopicDto extends Pick<_Base, 'notificationTopics'> {
            notificationTopics: firebaseAdmin.firestore.FieldValue;
        }

        export interface removeTopicDto extends addTopicDto { }
    }
}