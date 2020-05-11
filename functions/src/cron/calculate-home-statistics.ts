import * as functions from 'firebase-functions';
import { firestore } from '../utils/utils';

async function countMentors() {
    const snaps = await firestore.collection('mentors').get();
    const emails = snaps.docs.map(doc => doc.data()).map(mentor => mentor.email as string);
    const uniqueEmails = [...new Set(emails)];
    return uniqueEmails.length;
}

async function countStudents() {
    const snaps = await firestore.collection('students').get();
    const emails = snaps.docs.map(doc => doc.data()).map(student => student.email as string);
    const uniqueEmails = [...new Set(emails)];
    return uniqueEmails.length;
}

async function countAccompaniments() {
    const snaps = await firestore.collection('accompaniments').get();
    return snaps.size;
}

export const calculateHomeStatistics = functions
    .pubsub
    .schedule('0 23 * * *')
    // .schedule('*/5 * * * *')
    .onRun(async (_) => {
        const [mentors, students, accompaniments] = await Promise.all([countMentors(), countStudents(), countAccompaniments()])
        await firestore.doc('pages/home').set({ statistics: { mentors, students, accompaniments } }, { merge: true });
    });
