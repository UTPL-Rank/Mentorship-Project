import { firestore } from "firebase-admin";
import { dbFirestore } from "./utils";

type AcademicPeriod = any;

/**
 * Academic Periods Collection Reference
 * =========================================================
 * @author Bruno Esparza
 * 
 * Get the firestore collection of academic periods 
 */
function PeriodsCollection(): firestore.CollectionReference<AcademicPeriod> {
    return dbFirestore.collection('academic-periods')
}

/**
 * Get Current Period Reference
 * =========================================================
 *
 * @author Bruno Esparza
 *
 * Get the period reference to the current academic period enabled.
 * 
 * Also checks that only one and only one period is active, otherwise 
 * this mean that there are more than one current period at the time.
 * If there is more than one, an error of inconsistency is raised
 */
export async function CurrentPeriodReference(): Promise<firestore.DocumentReference<AcademicPeriod>> {
    const collRef = PeriodsCollection().where('current', '==', true);
    const snaps = await collRef.get();

    // Validate one and only one doc has been found
    if (snaps.size !== 1)
        throw new Error('Academic Period Consistency');

    const [periodSnap] = snaps.docs;

    return periodSnap.ref;
}