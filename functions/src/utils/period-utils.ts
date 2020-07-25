import { firestore } from "firebase-admin";
import { dbFirestore } from "./utils";

/**
 * Get Current Period Reference
 * =========================================================
 *
 * @author Bruno Esparza
 *
 * Get the period reference to the current academic period enabled
 */
export async function CurrentPeriodReference(): Promise<firestore.DocumentReference> {

    const collRef = dbFirestore.collection('academic-periods').where('current', '==', true);

    const snaps = await collRef.get();

    // Validate one and only one doc has been found
    if (snaps.size !== 1)
        throw new Error('Academic Periods Inconsistency');

    const [periodSnap] = snaps.docs;

    return periodSnap.ref;
}