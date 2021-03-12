import * as firebaseAdmin from 'firebase-admin';
import * as firebase from 'firebase/app';
import { SGMAccompaniment } from '../accompaniments';
import { SGMBaseAsset, SGMDocument, SGMImage, SGMVideo } from "../assets";
import { ChatParticipant } from './chat-participant';

export namespace SGMMessage {

    export const MessageKind = <const>['SGM#TEXT', 'SGM#ACCOMPANIMENT', 'SGM#BANNED', 'SGM#IMAGE', 'SGM#VIDEO', 'SGM#DOCUMENT'];

    export type MessageKindType = typeof MessageKind[number];

    export interface Accompaniment extends Pick<SGMAccompaniment.readDTO, 'id' | 'kind' | 'important' | 'student' | 'problems'> { }

    interface _Base {
        id: string;
        kind: MessageKindType;
        asset: SGMBaseAsset | SGMDocument | SGMImage | SGMVideo | null;
        text: string | null;
        accompaniment: Accompaniment | null;
        banned: boolean;
        date: firebase.firestore.Timestamp | firebase.firestore.FieldValue | firebaseAdmin.firestore.Timestamp;
        sender: ChatParticipant,
    }

    interface _BaseRead extends _Base {
        date: firebase.firestore.Timestamp;
    }

    interface _BaseCreate extends _Base {
        date: firebase.firestore.FieldValue;
    }

    interface _BaseText extends _Base {
        kind: 'SGM#TEXT';
        text: string;
        asset: null;
        accompaniment: null;
        banned: false;
    }

    export type readText = _BaseText & _BaseRead;
    export type createText = _BaseText & _BaseCreate;

    interface _BaseAccompaniment extends _Base {
        kind: 'SGM#ACCOMPANIMENT';
        text: null;
        asset: null;
        accompaniment: Accompaniment;
        banned: false;
    }

    export type readAccompaniment = _BaseAccompaniment & _BaseRead;

    interface _BaseBanned extends _Base {
        kind: 'SGM#BANNED';
        asset: null;
        text: null;
        accompaniment: null;
        banned: true;
    }

    export type readBanned = _BaseBanned & _BaseRead;

    interface _BaseAsset extends _Base {
        kind: 'SGM#IMAGE' | 'SGM#VIDEO' | 'SGM#DOCUMENT';
        asset: SGMBaseAsset | SGMDocument | SGMImage | SGMVideo;
        text: null;
        accompaniment: null;
        banned: false;
    }

    interface _BaseImage extends _BaseAsset {
        kind: 'SGM#IMAGE';
        asset: SGMImage;
    }


    export type readImage = _BaseImage & _BaseRead;
    export type createImage = _BaseImage & _BaseCreate;

    interface _BaseVideo extends _BaseAsset {
        kind: 'SGM#VIDEO';
        asset: SGMVideo;
    }


    export type readVideo = _BaseVideo & _BaseRead;
    export type createVideo = _BaseVideo & _BaseCreate;

    interface _BaseDocument extends _BaseAsset {
        kind: 'SGM#DOCUMENT';
        asset: SGMDocument;
    }

    export type readDocument = _BaseDocument & _BaseRead;
    export type createDocument = _BaseDocument & _BaseCreate;

    type multipleFormat =
        | _BaseText
        | _BaseAccompaniment
        | _BaseBanned
        | _BaseImage
        | _BaseVideo
        | _BaseDocument;

    export type readDto = multipleFormat & _BaseRead

    export module functions {


        interface _BaseReadFunctions {
            date: firebaseAdmin.firestore.Timestamp;
        }

        export type readDto = multipleFormat & _BaseReadFunctions

        interface _BaseCreateFunctions {
            date: firebaseAdmin.firestore.FieldValue;
        }

        export type updateBanned = _BaseBanned & _BaseCreateFunctions;

        export type createAccompaniment = _BaseAccompaniment & _BaseCreateFunctions;
    }
}
