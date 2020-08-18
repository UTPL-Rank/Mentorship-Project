import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ListMentorsWithNoAccompaniments, ListMentorsWithNoRecentAccompaniment } from '../utils/mentors-utils';
import { dbFirestore as dbFirestore } from '../utils/utils';

async function notifyMentors(mentors: Array<any>) {
    const batch = dbFirestore.batch();
    mentors.forEach(mentor => {
        const username = mentor.email.split('@')[0];
        const collection = dbFirestore.collection('users').doc(username).collection('notifications')
        const id = collection.doc().id;

        const notificationRef = collection.doc(id);
        const notification = {
            id,
            name: 'Realiza el acompañamiento',
            message: `${(mentor.displayName as string).toUpperCase()} no te olvides realizar el acompañamiento con tus estudiantes.`,
            read: false,
            redirect: `/panel-control/abr20-ago20/acompañamientos/nuevo/${mentor.id}`,
            time: firestore.FieldValue.serverTimestamp()
        };

        batch.set(notificationRef, notification);
    })

    return await batch.commit();
}


export const notifyMentorsAccompaniments = functions.pubsub.schedule('30 1 1,15 * *').onRun(async _ => {
    try {
        const sources = [ListMentorsWithNoAccompaniments(), ListMentorsWithNoRecentAccompaniment()];
        const [mentors1, mentors2] = await Promise.all(sources);
        const mentors = [...mentors1, ...mentors2];
        return await notifyMentors(mentors);
    } catch (err) {
        console.error(err);
        throw new Error('Error ocurred while sending mentors notifications');
    };

});