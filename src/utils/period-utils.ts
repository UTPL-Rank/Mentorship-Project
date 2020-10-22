import { firestore } from "firebase-admin";
import { dbFirestore } from "./utils";

export interface AcademicPeriod {
    id: string;
    name: string;
    date: firestore.Timestamp;
    current: boolean;
};

/**
 * Academic Periods Collection Reference
 * =========================================================
 * @author Bruno Esparza
 * 
 * Get the firestore collection of academic periods 
 */
function PeriodsCollection(): firestore.CollectionReference<AcademicPeriod> {
    return dbFirestore.collection('academic-periods') as firestore.CollectionReference<AcademicPeriod>;
}

/**
 * Academic Period Document Reference
 * =========================================================
 * @author Bruno Esparza
 * 
 * Get the firestore document of an academic period 
 * 
 * @param id identifier of the required period
 */
export function PeriodDocument(id: string): firestore.DocumentReference<AcademicPeriod> {
    const doc = PeriodsCollection().doc(id)
    return doc;
}

/**
 * Get Current Period Query snapshot
 * =========================================================
 *
 * @author Bruno Esparza
 *
 * Get the query snapshot of the current academic period enabled.
 * 
 * Also checks that only one and only one period is active, otherwise 
 * this mean that there are more than one current period at the time.
 * If there is more than one, an error of inconsistency is raised
 */
async function CurrentPeriodQuerySnapshot(): Promise<firestore.QueryDocumentSnapshot<AcademicPeriod>> {
    const collRef = PeriodsCollection().where('current', '==', true);
    const snaps = await collRef.get();

    // Validate one and only one doc has been found
    if (snaps.size !== 1)
        throw new Error('No Current Academic Period Found');

    return snaps.docs[0];
}

/**
 * Get Current Period Reference
 * =========================================================
 *
 * @author Bruno Esparza
 *
 * Get the period reference to the current academic period enabled.
 */
export async function CurrentPeriodReference(): Promise<firestore.DocumentReference<AcademicPeriod>> {
    const periodSnap = await CurrentPeriodQuerySnapshot();
    const periodId = periodSnap.data().id;
    const ref = PeriodDocument(periodId)

    return ref;
}

/**
 * Get Current Academic Period
 * ============================================================
 * 
 * @author Bruno Esparza
 * 
 * Get the data of the current academic period, with this method we can 
 * asume that we will always recibe a valid period, otherwise an error is thrown
 */
export async function CurrentPeriod(): Promise<AcademicPeriod> {
    const periodSnap = await CurrentPeriodQuerySnapshot();

    return periodSnap.data();
}
