import * as firebase from 'firebase/app';
import { SGMAccompaniment } from '../accompaniments';
import { SGMBaseAsset, SGMDocument, SGMImage, SGMVideo } from "../assets";

export namespace SGMMessage {

    export const MessageKind = <const>['SGM#TEXT', 'SGM#ACCOMPANIMENT', 'SGM#BANNED', 'SGM#IMAGE', 'SGM#VIDEO', 'SGM#DOCUMENT'];

    export type MessageKindType = typeof MessageKind[number];

    export interface Accompaniment extends Pick<SGMAccompaniment.readDTO, 'id' | 'kind' | 'important' | 'student' | 'problems'> { }

    interface _Base {
        kind: MessageKindType;
        asset: SGMBaseAsset | SGMDocument | SGMImage | SGMVideo | null;
        text: string | null;
        accompaniment: Accompaniment | null;
        banned: boolean;
        date: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
    }

    interface _BaseText extends _Base {
        kind: 'SGM#TEXT';
        text: string;
        asset: null;
        accompaniment: null;
        banned: false;
    }

    interface _BaseAccompaniment extends _Base {
        kind: 'SGM#ACCOMPANIMENT';
        text: null;
        asset: null;
        accompaniment: Accompaniment;
        banned: false;
    }

    interface _BaseBanned extends _Base {
        kind: 'SGM#BANNED';
        asset: null;
        text: null;
        accompaniment: null;
        banned: true;
    }

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

    interface _BaseVideo extends _BaseAsset {
        kind: 'SGM#VIDEO';
        asset: SGMVideo;
    }

    interface _BaseDocument extends _BaseAsset {
        kind: 'SGM#DOCUMENT';
        asset: SGMDocument;
    }

    interface _BaseRead {
        date: firebase.firestore.Timestamp;
    }

    interface _BaseCreate {
        date: firebase.firestore.FieldValue;
    }

    type multipleFormat =
        | _BaseText
        | _BaseAccompaniment
        | _BaseBanned
        | _BaseImage
        | _BaseVideo
        | _BaseDocument;

    export type readDto = multipleFormat & _BaseRead

    export type createDto = multipleFormat & _BaseCreate
}
