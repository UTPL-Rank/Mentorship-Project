import * as firebaseAdmin from "firebase-admin";
import * as firebase from 'firebase/app';
import { ChatParticipant } from "./chat-participant";
import { SGMMessage } from "./message";
 
export namespace SGMChat {

    /**
     * base chat information
     */
    interface _Base {
        id: string;

        participants: Array<ChatParticipant>;

        /**
         * identifier of users for easy query
         */
        participantsUid: Array<string>;

        lastMessage: SGMMessage.readDto | null;

        lastActivity: firebase.firestore.Timestamp | firebaseAdmin.firestore.Timestamp | firebaseAdmin.firestore.FieldValue;

        /**
         * whether if chat has been disabled
         */
        disabled: boolean;
    }

    /**
     * Chat information when reading from the db
     */
    export interface readDto extends _Base {
        lastActivity: firebase.firestore.Timestamp;
    }
    
    
    export module functions {

        export interface readDto extends _Base {
            lastActivity: firebaseAdmin.firestore.Timestamp;
        }

        /**
         * Fields requires when creating a new chat.
         * 
         * Important note: there is a minimum of 2 persons in a chat to be a valid chat
         */
        export interface createDto extends _Base {
    
            participants: [ChatParticipant, ChatParticipant];
    
            participantsUid: [string, string];
    
            disabled: false;
    
            lastMessage: null;

            lastActivity: firebaseAdmin.firestore.FieldValue;
        }

        export interface disableChatDto extends Pick<_Base, 'disabled'> {
            disabled: true;
        }

        export interface enableChatDto extends Pick<_Base, 'disabled'> {
            disabled: false;
        }

        export interface updateLastMessageDto extends Pick<_Base, 'lastMessage'> {
            lastMessage: SGMMessage.readDto;
        }
    }
}