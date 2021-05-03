import { SGMStudent } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { _MentorDocument } from "./mentors-utils";
import { CurrentPeriodReference, PeriodDocument } from "./period-utils";
import { dbFirestore } from "./utils";

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

export function _StudentDocument(studentId: string): firestore.DocumentReference<SGMStudent.readDTO> {
    const document = StudentCollection().doc(studentId) as firestore.DocumentReference<SGMStudent.readDTO>;

    return document;
}

/**
 * List Students of the current period
 * ================================================
 * 
 * @author Bruno Esparza
 * 
 * @returns students in the current academic period 
 */
export async function ListStudentsCurrentPeriod(): Promise<Array<SGMStudent.readDTO>> {
    const periodRef = await CurrentPeriodReference();
    const collection = StudentCollection().where('period.reference', '==', periodRef);

    const snap = await collection.get();
    const students = snap.docs.map(doc => doc.data() as SGMStudent.readDTO);

    return students;
}

/**
 * List Students of the period
 * ================================================
 * 
 * @author Bruno Esparza
 * 
 * @param identifier of the period id
 * 
 * @returns students in the academic period 
 */
export async function ListStudentsPeriod(periodId: string): Promise<Array<SGMStudent.readDTO>> {
    const periodRef = PeriodDocument(periodId);
    const collection = StudentCollection().where('period.reference', '==', periodRef);

    const snap = await collection.get();
    const students = snap.docs.map(doc => doc.data() as SGMStudent.readDTO);

    return students;
}

/**
 * Get one student
 * ================================================
 * 
 * @author Bruno Esparza
 * 
 * @param studentId identifier of the student
 * 
 * @returns student data if exists 
 */
export async function OneStudent(studentId: string): Promise<SGMStudent.readDTO | null> {
    const document = StudentCollection().doc(studentId);
    const snap = await document.get();
    const student = snap.exists ? snap.data() as SGMStudent.readDTO : null;

    return student;
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
export async function ListStudentsOfMentor(mentorId: string): Promise<Array<SGMStudent.readDTO>> {
    const periodRef = await CurrentPeriodReference();
    const mentorRef = _MentorDocument(mentorId);

    const collection = StudentCollection()
        .where('period.reference', '==', periodRef)
        .where('mentor.reference', '==', mentorRef);

    const snap = await collection.get();
    const students = snap.docs.map(doc => doc.data() as SGMStudent.readDTO);

    return students;
}
