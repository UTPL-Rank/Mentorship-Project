import firebase from 'firebase/app';
import { SGMAcademicArea } from "./academic-area";
import { SGMAcademicDegree } from "./academic-degree";
import { SGMAcademicPeriod } from "./academic-period";
import { SGMMentor } from "./mentor";

export namespace SGMStudent {

    const academicCycleKind = ['sgm#first', 'sgm#second', 'sgm#third'] as const;

    export type AcademicCycle = typeof academicCycleKind[number];

    interface base {
        id: string;

        displayName: string;

        email: string;

        cycle: AcademicCycle;

        area: { reference: SGMAcademicArea.reference; name: string; };

        degree: { reference: SGMAcademicDegree.reference; name: string; };

        period: { reference: SGMAcademicPeriod.reference; name: string; };

        mentor: { reference: SGMMentor.reference; displayName: string; email: string; };

        stats: {
            accompanimentsCount: number;
            lastAccompaniment?: firebase.firestore.Timestamp | null;
        };
    }

    export type readDTO = base;

    export interface createDTO extends base {
        stats: {
            accompanimentsCount: 0;
            lastAccompaniment?: null;
        };
    }

    export interface updateDTO {
        'stats/accompanimentsCount': firebase.firestore.FieldValue;
        'stats/lastAccompaniment': firebase.firestore.FieldValue;
    }

    export type reference = firebase.firestore.DocumentReference<base>;

    export function translateCycle(condition: AcademicCycle): string {

        if (condition === 'sgm#first')
            return 'Primero'
        if (condition === 'sgm#second')
            return 'Segundo'
        if (condition === 'sgm#third')
            return 'Tercero'

        return `Error: ${condition}`;
    }
}