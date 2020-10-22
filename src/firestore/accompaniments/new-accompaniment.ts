import * as functions from 'firebase-functions';
import { Accompaniment } from '../../utils/accompaniments-utils';
import { DEFAULT_EMAIL_SEND, ProgramSendEmail } from '../../utils/mailing-utils';
import { Notification, SendNotification } from '../../utils/notifiactions-utils';
import { UsernameFromEmail } from '../../utils/users-utils';
import { BASE_URL } from '../../utils/variables';

async function notifyUserOfAccompaniment({ id, student, mentor, period, reviewKey }: Accompaniment): Promise<void> {
  const studentUsername = UsernameFromEmail(student.email);

  const email = {
    to: student.email,
    from: DEFAULT_EMAIL_SEND,
    templateId: 'd-db5d5d6bfb6649c1afcb97151da70051',
    dynamic_template_data: {
      redirectUrl: `${BASE_URL}/panel-control/${period.reference.id}/calificar-acompañamiento/${student.id}/${id}/${reviewKey}`,
      accompanimentId: id,
      studentName: student.displayName.toUpperCase(),
      mentorName: mentor.displayName.toUpperCase(),
    },
  };

  // send notification
  const notification: Partial<Notification> = {
    name: 'Validación de Acompañamiento',
    message: `${mentor?.displayName?.toUpperCase()} ha registrado un nuevo acompañamiento, ayudanos validando.`,
    redirect: `/panel-control/${period?.reference?.id}/calificar-acompañamiento/${student?.id}/${id}/${reviewKey}`,
  }

  const tasks: Array<Promise<void>> = [ProgramSendEmail(studentUsername, email), SendNotification(studentUsername, notification)];

  await Promise.all(tasks);
}

// async function notifyAdminImportantAccompaniment(accompaniment: Accompaniment) {
//   // get administrators
//   const snaps = await firestore().collection('claims').where('isAdmin', '==', true).get();
//   const emails = snaps.docs.map(s => s.id);

//   const tasks = emails.map(async email => {
//     const username = UsernameFromEmail(email)
//     const id = firestore().collection('users').doc(username).collection('notifications').doc().id;
//     const notification: Partial<Notification> = {
//       id,
//       name: 'Acompañamiento Importante',
//       message: `${accompaniment.mentor.displayName.toUpperCase()} ha marcado un acompañamiento como importante.`,
//       read: false,
//       redirect: `/panel-control/abr20-ago20/acompañamientos/ver/${accompaniment.mentor.reference.id}/${accompaniment.id}`,
//       time: firestore.FieldValue.serverTimestamp()
//     };

//     await SendNotification(username, notification);
//   })

//   await Promise.all(tasks);
// }

export const mailAccompanimentReview = functions.firestore
  .document('accompaniments/{accompanimentId}')
  .onCreate(async (document, _) => {
    const accompaniment = (document.exists) ? document.data() as Accompaniment : null;

    if (!accompaniment)
      return;

    const tasks = [];

    tasks.push(notifyUserOfAccompaniment(accompaniment));

    // accompaniment tagged as important 
    // send notification to administrators
    // if (accompaniment.important)
    //   tasks.push(notifyAdminImportantAccompaniment(accompaniment));

    await Promise.all(tasks);
  });
