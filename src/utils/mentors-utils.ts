import { CurrentPeriodReference, PeriodDocument } from "./period-utils";
import { dbFirestore } from "./utils";

type Mentor = any;


/**
 * Mentor Firestore Collection
 * ==========================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore collection of mentors
 */
function MentorCollection() {
    return dbFirestore.collection('mentors');
}

/**
 * Firestore Mentor Document
 * ===============================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore document of a mentor
 * 
 * @param id Identifier of the mentor document 
 */
function MentorDocument(id: string) {
    return MentorCollection().doc(id);
}

/**
 * Mentor Reference
 * ===============================================
 * 
 * @author Bruno Esparza
 * 
 * Get the reference to a mentor
 * 
 * @param id identifier of the mentor
 */
export function MentorReference(id: string) {
    return MentorDocument(id);
}

/**
 * List Mentors Current Period
 * ==================================================
 * 
 * @author Bruno Esparza
 * 
 * @returns list of mentors of the current academic period
 */
export async function ListMentorsCurrentPeriod(): Promise<Array<Mentor>> {
    const periodRef = await CurrentPeriodReference();
    const collection = MentorCollection()
        .where('period.reference', '==', periodRef)

    const snap = await collection.get();

    const mentors = snap.docs.map(doc => doc.data());

    return mentors;
}

/**
 * List Mentors Period
 * ==================================================
 * 
 * @author Bruno Esparza
 * 
 * Get all the students registered in an academic period
 * 
 * @param periodId identifier of the academic period
 * 
 * @returns list of mentors of the academic period
 */
export async function ListMentorsPeriod(periodId: string): Promise<Array<Mentor>> {
    const periodRef = PeriodDocument(periodId);
    const collection = MentorCollection().where('period.reference', '==', periodRef)
    const snap = await collection.get();
    const mentors = snap.docs.map(doc => doc.data());

    return mentors;
}

/**
 * Time Travel Date
 * ==================================================
 * 
 * Travel on time and get the date of the day you traveled to
 * 
 * @param days number of day too travel on time
 */
function TimeTravelDate(days: number): Date {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today;
}

/**
 * List Mentors With no Resent Accompaniments
 * ====================================================
 * 
 * @author Bruno Esparza
 * 
 * Get a list of mentors that hasn't registered an accompaniment in the last two weeks
 */
export async function ListMentorsWithNoRecentAccompaniment(): Promise<Array<Mentor>> {
    const periodRef = await CurrentPeriodReference();
    const twoWeeksAgo = TimeTravelDate(-14);

    const collection = dbFirestore.collection('mentors')
        .where('period.reference', '==', periodRef)
        .where('stats.lastAccompaniment', '<=', twoWeeksAgo);

    const snap = await collection.get();
    const mentors = snap.docs.map(doc => doc.data());

    return mentors;
}

/**
 * List Mentors With no accompaniments at all
 * =======================================================
 * 
 * @author Bruno Esparza
 * 
 * Get a list of mentors that doesn't have registered an accompaniment yet
 */
export async function ListMentorsWithNoAccompaniments(): Promise<Array<Mentor>> {
    const periodRef = await CurrentPeriodReference();

    const collection = dbFirestore.collection('mentors')
        .where('period.reference', '==', periodRef)
        .where('stats.lastAccompaniment', '==', null);

    const snap = await collection.get();
    const mentors = snap.docs.map(doc => doc.data());

    return mentors;
}

/**
 * Mentor Detail Evaluation
 * ==================================
 * 
 * @author Bruno Esparza
 * 
 * Get the details evaluation of a mentor
 * 
 * @param mentorId identifier of the mentor
 */
export async function GetMentorDetailsEvaluation(mentorId: string): Promise<{ mentorFirstTime: boolean } | null> {
    const mentorRef = MentorReference(mentorId);
    const evalRef = mentorRef.collection('evaluation').doc('details');
    const snap = await evalRef.get();
    const detailsEval = snap.exists ? snap.data() as { mentorFirstTime: boolean } : null;

    return detailsEval;
}