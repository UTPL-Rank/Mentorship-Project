import { SGMMentor } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { _MentorDocument } from "./mentors-utils";
import { AcademicPeriod, CurrentPeriodReference, PeriodDocument } from "./period-utils";
import { dbFirestore } from "./utils";

export type AcademicCycleKind = 'sgm#first' | 'sgm#second' | 'sgm#third';

export type StudentReference = firestore.DocumentReference<Student>;

export type Students = Array<Student>;

export interface Student {
    id: string;
    displayName: string;
    email: string;
    cycle: AcademicCycleKind;

    area: {
        reference: firestore.DocumentReference;
        name: string;
    };

    degree: {
        reference: firestore.DocumentReference;
        name: string;
    };

    period: {
        reference: firestore.DocumentReference<AcademicPeriod>;
        name: string;
        date: firestore.Timestamp
    };

    mentor: {
        reference: firestore.DocumentReference<SGMMentor.readDTO>;
        displayName: string;
        email: string;
    };

    stats: {
        accompanimentsCount: number;
        lastAccompaniment?: firestore.Timestamp;
    }
}

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

export function _StudentDocument(studentId: string): firestore.DocumentReference<Student> {
    const document = StudentCollection().doc(studentId) as firestore.DocumentReference<Student>;

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
export async function ListStudentsCurrentPeriod(): Promise<Array<Student>> {
    const periodRef = await CurrentPeriodReference();
    const collection = StudentCollection().where('period.reference', '==', periodRef);

    const snap = await collection.get();
    const students = snap.docs.map(doc => doc.data() as Student);

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
export async function ListStudentsPeriod(periodId: string): Promise<Array<Student>> {
    const periodRef = PeriodDocument(periodId);
    const collection = StudentCollection().where('period.reference', '==', periodRef);

    const snap = await collection.get();
    const students = snap.docs.map(doc => doc.data() as Student);

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
export async function OneStudent(studentId: string): Promise<Student | null> {
    const document = StudentCollection().doc(studentId);
    const snap = await document.get();
    const student = snap.exists ? snap.data() as Student : null;

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
export async function ListStudentsOfMentor(mentorId: string): Promise<Array<Student>> {
    const periodRef = await CurrentPeriodReference();
    const mentorRef = _MentorDocument(mentorId);

    const collection = StudentCollection()
        .where('period.reference', '==', periodRef)
        .where('mentor.reference', '==', mentorRef);

    const snap = await collection.get();
    const students = snap.docs.map(doc => doc.data() as Student);

    return students;
}
