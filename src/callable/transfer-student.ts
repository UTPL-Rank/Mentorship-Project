import { SGMMentor } from '@utpl-rank/sgm-helpers';
import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { OneMentor, _MentorDocument } from '../utils/mentors-utils';
import { CurrentPeriod } from '../utils/period-utils';
import { OneStudent, Student, _StudentDocument } from '../utils/student-utils';
import { dbFirestore } from '../utils/utils';

interface TransferStudentDTO {
    newMentorId: string;
    studentId: string;
}

export const TransferStudent = functions.https.onCall(async (data: TransferStudentDTO) => {
    const { newMentorId, studentId } = data;

    const student = await OneStudent(studentId);

    if (!student)
        return false;

    const [newMentor, oldMentor] = await Promise.all([OneMentor(newMentorId), OneMentor(student.mentor.reference.id)]);

    if (!newMentor || !oldMentor)
        return false;

    const period = await CurrentPeriod();
    const everybodyIsIncurrentPeriod = [student.period.reference.id, oldMentor.period.reference.id, newMentor.period.reference.id]
        .every(id => id === period.id);

    if (!everybodyIsIncurrentPeriod)
        return false;

    const studentUpdateData: Partial<Student> = {
        mentor: {
            displayName: newMentor.displayName,
            email: newMentor.email,
            reference: _MentorDocument(newMentor.id),
        }
    };
    const oldMentorUpdateData: Partial<SGMMentor.updateDTO> = {
        'students/withAccompaniments': firestore.FieldValue.arrayRemove(student.displayName),
        'students/withoutAccompaniments': firestore.FieldValue.arrayRemove(student.displayName),
        'stats/assignedStudentCount': firestore.FieldValue.increment(-1),
    };

    const newMentorUpdateData: Partial<SGMMentor.updateDTO> = {
        'students/withoutAccompaniments': firestore.FieldValue.arrayUnion(student.displayName),
        'stats/assignedStudentCount': firestore.FieldValue.increment(-1),
    };

    const batch = dbFirestore.batch();

    batch.update(_StudentDocument(student.id), studentUpdateData);
    batch.update(_MentorDocument(oldMentor.id), oldMentorUpdateData);
    batch.update(_MentorDocument(newMentor.id), newMentorUpdateData);

    try {
        await batch.commit();
        return true;
    } catch (err) {
        return false;
    }
});

