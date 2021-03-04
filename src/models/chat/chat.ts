import { SGMMessage } from "./message";

export namespace SGMChat {

    /**
     * minimum information required to identify all the participants in a chat
     */
    export interface ChatParticipant {
        uid: string;
        displayName: string;
        email: string;
    }

    /**
     * base chat information
     */
    interface _Base {
        participants: Array<ChatParticipant>;

        /**
         * identifier of users for easy query
         */
        participantsUid: Array<string>;

        lastMessage: SGMMessage.readDto | null;

        /**
         * whether if chat has been disabled
         */
        disabled: boolean;
    }

    /**
     * Chat information when reading from the db
     */
    export interface readDto extends _Base { }

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
    }

    export module functions {
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