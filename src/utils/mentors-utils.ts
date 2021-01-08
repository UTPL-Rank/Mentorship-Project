import { SGMMentor } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { CurrentPeriodReference, PeriodDocument } from "./period-utils";
import { dbFirestore } from "./utils";

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
export function _MentorDocument(id: string): firestore.DocumentReference<SGMMentor.readDTO> {
    return MentorCollection().doc(id) as firestore.DocumentReference<SGMMentor.readDTO>;
}

/**
 * Mentor Reference
 * ===============================================
 * 
 * @author Bruno Esparza
 * 
 * Get the reference to a mentor
 * 
 * @deprecated use `_MentorDocument` instead
 * 
 * @param id identifier of the mentor
 */
export const MentorReference = _MentorDocument;

/**
 * List Mentors Current Period
 * ==================================================
 * 
 * @author Bruno Esparza
 * 
 * @returns list of mentors of the current academic period
 */
export async function ListMentorsCurrentPeriod(): Promise<Array<SGMMentor.readDTO>> {
    const periodRef = await CurrentPeriodReference();
    const collection = MentorCollection()
        .where('period.reference', '==', periodRef)

    const snap = await collection.get();

    const mentors = snap.docs.map(doc => doc.data() as SGMMentor.readDTO);

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
export async function ListMentorsPeriod(periodId: string): Promise<Array<SGMMentor.readDTO>> {
    const periodRef = PeriodDocument(periodId);
    const collection = MentorCollection().where('period.reference', '==', periodRef)
    const snap = await collection.get();
    const mentors = snap.docs.map(doc => doc.data() as SGMMentor.readDTO);

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
    console.log('TODO: move function to correct file');

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
export async function ListMentorsWithNoRecentAccompaniments(): Promise<Array<SGMMentor.readDTO>> {
    const periodRef = await CurrentPeriodReference();
    const twoWeeksAgo = TimeTravelDate(-21);

    const collection = dbFirestore.collection('mentors')
        .where('period.reference', '==', periodRef)
        .where('stats.lastAccompaniment', '<=', twoWeeksAgo);

    const snap = await collection.get();
    const mentors = snap.docs.map(doc => doc.data() as SGMMentor.readDTO);

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
export async function ListMentorsWithNoRegisteredAccompaniments(): Promise<Array<SGMMentor.readDTO>> {
    const periodRef = await CurrentPeriodReference();

    const collection = dbFirestore.collection('mentors')
        .where('period.reference', '==', periodRef)
        .where('stats.accompanimentsCount', '==', 0);

    const snap = await collection.get();
    const mentors = snap.docs.map(doc => doc.data() as SGMMentor.readDTO);

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
    const mentorRef = _MentorDocument(mentorId);
    const evalRef = mentorRef.collection('evaluation').doc('details');
    const snap = await evalRef.get();
    const detailsEval = snap.exists ? snap.data() as { mentorFirstTime: boolean } : null;

    return detailsEval;
}

export async function OneMentor(mentorId: string): Promise<SGMMentor.readDTO | null> {
    const mentorDoc = MentorCollection().doc(mentorId) as firestore.DocumentReference<SGMMentor.readDTO>;
    const snapshot = await mentorDoc.get();
    const mentor = snapshot.exists ? snapshot.data() as SGMMentor.readDTO : null;

    return mentor;
}
export async function FindOneMentorFromPeriod(mentorId: string, periodId: string): Promise<SGMMentor.readDTO | null> {
    console.log('cant return a boolean');

    const periodRef = PeriodDocument(periodId)
    const mentorsQuery = MentorCollection().where('id', '==', mentorId).where('period.reference', '==', periodRef) as firestore.CollectionReference<SGMMentor.readDTO>;
    const snaps = await mentorsQuery.get();

    if (snaps.size !== 1)
        return null

    return snaps.docs[0].data();
}