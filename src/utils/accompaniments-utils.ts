import { firestore } from "firebase-admin";
import { CurrentPeriodReference } from "./period-utils";
import { dbFirestore } from "./utils";

type Accompaniment = any;

/**
 * Accompaniments Firestore Collection
 * ==========================
 * 
 * @author Bruno Esparza
 * 
 * Get the accompaniments firestore collection
 */
function AccompanimentsCollection(): firestore.CollectionReference<Accompaniment> {
    return dbFirestore.collection('accompaniments');
}

/**
 * Accompaniment Firestore Document
 * ===============================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore document of an accompaniments
 * 
 * @param id Identifier of the accompaniment document 
 */
function AccompanimentDocument(id: string): firestore.DocumentReference<Accompaniment> {
    return AccompanimentsCollection().doc(id);
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
    const query = AccompanimentsCollection().where('period.reference', '==', periodRef)
    const { docs } = await query.get();
    const accompaniments = docs.map(doc => doc.data());

    return accompaniments;
}
