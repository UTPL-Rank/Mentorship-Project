import { MentorReference } from "./mentors-utils";
import { CurrentPeriodReference } from "./period-utils";
import { dbFirestore } from "./utils";

type Student = any;

/**
 * Students Firestore Collection
 * ============================================
 * 
 * @author Bruno Esparza
 * 
 * @returns firestore collection of students
 */
function StudentCollection() {
    return dbFirestore.collection('students');
}

/**
 * List Students of the current period
 * ================================================
 * 
 * @author Bruno Esparza
 * 
 * @returns students in the current academic period 
 */
export async function ListStudentsCurrentPeriod(): Promise<Array<Student>> {
    const periodRef = await CurrentPeriodReference();
    const collection = StudentCollection().where('period.reference', '==', periodRef);

    const snap = await collection.get();
    const students = snap.docs.map(doc => doc.data());

    return students;
}

/**
 * List students of mentor
 * =================================================
 * 
 * @author Bruno Esparza
 * 
 * Get a list of the students of a specific mentor, in the current academic period
 * 
 * @param mentorId identifier of the mentor
 */
export async function ListStudentsOfMentor(mentorId: string): Promise<Array<Student>> {
    const periodRef = await CurrentPeriodReference();
    const mentorRef = MentorReference(mentorId);

    const collection = StudentCollection()
        .where('period.reference', '==', periodRef)
        .where('mentor.reference', '==', mentorRef);

    const snap = await collection.get();
    const students = snap.docs.map(doc => doc.data());

    return students;
}