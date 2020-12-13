
export namespace SGMAcademicArea {

    export const AreasOptions = <const>['administrativa', 'biologica', 'sociohumanistica', 'tecnica'];

    export type AreaType = typeof AreasOptions[number];

    interface _Base {
        id: AreaType;
        name: string;
    }

    export type readDTO = _Base;

    export function validArea(id: AreaType): boolean {
        return AreasOptions.includes(id);
    }
}