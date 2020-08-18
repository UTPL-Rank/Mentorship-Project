import { CurrentPeriodReference } from "./period-utils";
import { dbFirestore } from "./utils";

type Accompaniment = any;

/**
 * Accompaniments Firestore Collection
 * ==========================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore collection of accompaniments
 */
function AccompanimentsCollection() {
    return dbFirestore.collection('accompaniments');
}

/**
 * Firestore Accompaniments Document
 * ===============================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore document of a accompaniments
 * 
 * @param id Identifier of the accompaniment document 
 */
function AccompanimentDocument(id: string) {
    return AccompanimentsCollection().doc(id);
}

/**
 * Accompaniment Reference
 * ===============================================
 * 
 * @author Bruno Esparza
 * 
 * Get the reference to a accompaniment
 * 
 * @param id identifier of the accompaniment
 */
export function AccompanimentReference(id: string) {
    return AccompanimentDocument(id);
}

/**
 * List Accompaniments Current Period
 * ==================================================
 * 
 * @author Bruno Esparza
 * 
 * @returns list of accompaniments of the current academic period
 */
export async function ListAccompanimentsCurrentPeriod(): Promise<Array<Accompaniment>> {
    const periodRef = await CurrentPeriodReference();
    const collection = AccompanimentsCollection()
        .where('period.reference', '==', periodRef)

    const snap = await collection.get();

    const accompaniments = snap.docs.map(doc => doc.data());

    return accompaniments;
}
