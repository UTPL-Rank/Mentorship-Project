import { firestore } from "firebase-admin";
import { CurrentPeriodReference, PeriodDocument } from "./period-utils";
import { dbFirestore } from "./utils";

export type FollowingKind = 'sgm#virtual' | 'sgm#presencial';
export type SemesterKind = 'sgm#firstSemester' | 'sgm#secondSemester';
export interface Accompaniment {
    timeCreated: firestore.Timestamp;
    problems: {
        problemCount: number;

        academic: boolean;
        administrative: boolean;
        economic: boolean;
        psychosocial: boolean;
        none: boolean;

        /** @deprecated */
        otherDescription: string;
        /** @deprecated */
        other: boolean;
    };
    problemDescription?: string;
    solutionDescription?: string;

    topic?: string;
    topicDescription?: string;
    semesterKind: SemesterKind;
    followingKind: FollowingKind;
    important: boolean;
    id: string;
    student: {
        id: string;
        email: string;
        displayName: string;
        reference: firestore.DocumentReference,
    }
    mentor: {
        id: string;
        email: string;
        displayName: string;
        reference: firestore.DocumentReference,
    }
    period: {
        reference: firestore.DocumentReference,
        name: string;
        date: firestore.Timestamp
    }
    reviewKey?: string;

    degree: {
        reference: firestore.DocumentReference;
        name: string;
    };

    area: {
        reference: firestore.DocumentReference;
        name: string;
    };
}

export interface FirestoreAccompanimentProblems {
    problemCount: number;
    academic: boolean;
    administrative: boolean;
    economic: boolean;
    psychosocial: boolean;
    other: boolean;
    none: boolean;
    otherDescription: string;
}

/**
 * Accompaniments Firestore Collection
 * ==========================
 * 
 * @author Bruno Esparza
 * 
 * Get the accompaniments firestore collection
 */
function AccompanimentsCollection(): firestore.CollectionReference<Accompaniment> {
    return dbFirestore.collection('accompaniments') as firestore.CollectionReference<Accompaniment>;
}

// /**
//  * Accompaniment Firestore Document
//  * ===============================================
//  * 
//  * @author Bruno Esparza
//  * 
//  * Get the firestore document of an accompaniments
//  * 
//  * @param id Identifier of the accompaniment document 
//  */
// function AccompanimentDocument(id: string): firestore.DocumentReference<Accompaniment> {
//     return AccompanimentsCollection().doc(id);
// }

/**
 * List Accompaniments of Specific Period
 * ==================================================
 * 
 * @author Bruno Esparza
 * 
 * list all the accompaniments of the required academic period
 * 
 * @param periodId identifier of the required academic period
 */
export async function ListAccompanimentsPeriod(periodId: string): Promise<Array<Accompaniment>> {
    const periodRef = PeriodDocument(periodId);
    const query = AccompanimentsCollection().where('period.reference', '==', periodRef)
    const { docs } = await query.get();
    const accompaniments = docs.map(doc => doc.data());

    return accompaniments;
}

/**
 * List Accompaniments Current Period
 * ==================================================
 * 
 * @author Bruno Esparza
 * 
 * list all the accompaniments of the current academic period
 */
export async function ListAccompanimentsCurrentPeriod(): Promise<Array<Accompaniment>> {
    const periodRef = await CurrentPeriodReference();
    const accompaniments = ListAccompanimentsPeriod(periodRef.id);

    return accompaniments;
}
