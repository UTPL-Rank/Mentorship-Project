import firebase from 'firebase/app';

export namespace SGMAcademicArea {

    const areas = <const>['administrativa', 'biologica', 'sociohumanistica', 'tecnica'];

    export type AreaType = typeof areas[number];

    interface _Base {
        id: AreaType;
        name: string;
    }

    export type readDTO = _Base;

    export type reference = firebase.firestore.DocumentReference<_Base>;

    export function validArea(id: AreaType): boolean {
        return areas.includes(id);
    }
}