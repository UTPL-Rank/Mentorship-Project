import { firestore } from "firebase/app";

export namespace SGMStudent {

    const academicCycleKind = ['sgm#first', 'sgm#second', 'sgm#third'] as const;

    export type AcademicCycle = typeof academicCycleKind[number];

    interface base {
        id: string;

        displayName: string;

        email: string;

        cycle: AcademicCycle;

        area: { reference: firestore.DocumentReference; name: string; };

        degree: { reference: firestore.DocumentReference; name: string; };

        period: { reference: firestore.DocumentReference; name: string; };

        mentor: { reference: firestore.DocumentReference; displayName: string; email: string; };

        /** determinate if it is not the first semester as a mentored student */
        continues?: boolean;

        stats: {
            accompanimentsCount: number;
            lastAccompaniment?: firestore.Timestamp | null;
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
        'stats/accompanimentsCount': firestore.FieldValue;
        'stats/lastAccompaniment': firestore.FieldValue;
    }

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