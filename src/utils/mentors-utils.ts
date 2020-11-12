import { firestore } from "firebase-admin";
import { CurrentPeriodReference, PeriodDocument } from "./period-utils";
import { dbFirestore } from "./utils";

export interface Mentor {
    id: string;
    displayName: string;
    email: string;
    ci: string;

    period: {
        reference: firestore.CollectionReference;
        name: string;
        date: firestore.Timestamp
    };

    area: {
        reference: firestore.CollectionReference;
        name: string;
    };

    degree: {
        reference: firestore.CollectionReference;
        name: string;
    };

    stats: {
        assignedStudentCount: number;
        accompanimentsCount: number;
        lastAccompaniment?: firestore.Timestamp;
    };

    students: {
        withAccompaniments: Array<string>;
        withoutAccompaniments: Array<string>;
        degrees: Array<string>;
        //   cycles: Array<AcademicCycleKind>;
    };
}

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
export function _MentorDocument(id: string): firestore.DocumentReference<Mentor> {
    return MentorCollection().doc(id) as firestore.DocumentReference<Mentor>;
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
export async function ListMentorsCurrentPeriod(): Promise<Array<Mentor>> {
    const periodRef = await CurrentPeriodReference();
    const collection = MentorCollection()
        .where('period.reference', '==', periodRef)

    const snap = await collection.get();

    const mentors = snap.docs.map(doc => doc.data() as Mentor);

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
    const mentors = snap.docs.map(doc => doc.data() as Mentor);

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
export async function ListMentorsWithNoRecentAccompaniments(): Promise<Array<Mentor>> {
    const periodRef = await CurrentPeriodReference();
    const twoWeeksAgo = TimeTravelDate(-21);

    const collection = dbFirestore.collection('mentors')
        .where('period.reference', '==', periodRef)
        .where('stats.lastAccompaniment', '<=', twoWeeksAgo);

    const snap = await collection.get();
    const mentors = snap.docs.map(doc => doc.data() as Mentor);

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
export async function ListMentorsWithNoRegisteredAccompaniments(): Promise<Array<Mentor>> {
    const periodRef = await CurrentPeriodReference();

    const collection = dbFirestore.collection('mentors')
        .where('period.reference', '==', periodRef)
        .where('stats.accompanimentsCount', '==', 0);   

    const snap = await collection.get();
    const mentors = snap.docs.map(doc => doc.data() as Mentor);

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

export async function OneMentor(mentorId: string): Promise<Mentor | null> {
    const mentorDoc = MentorCollection().doc(mentorId) as firestore.DocumentReference<Mentor>;
    const snapshot = await mentorDoc.get();
    const mentor = snapshot.exists ? snapshot.data() as Mentor : null;

    return mentor;
}