import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { sendEmail } from '../../utils/utils';
import { BASE_URL, DEFAULT_EMAIL_SEND } from '../../utils/variables';

async function sendEmailToUser(
  accompaniment: firestore.DocumentData & {
    student?: { email?: string; displayName?: string; id?: string };
    reviewKey?: string;
    id?: string;
    mentor?: { displayName?: string };
    period?: { reference?: { id?: string } };
  },
) {
  try {
    const msg = {
      to: accompaniment?.student?.email,
      from: DEFAULT_EMAIL_SEND,
      templateId: 'd-db5d5d6bfb6649c1afcb97151da70051',
      dynamic_template_data: {
        redirectUrl: `${BASE_URL}/panel-control/${accompaniment?.period?.reference?.id}/calificar-acompañamiento/${accompaniment?.student?.id}/${accompaniment.id}/${accompaniment.reviewKey}`,
        accompanimentId: accompaniment.id,
        studentName: accompaniment?.student?.displayName?.toUpperCase(),
        mentorName: accompaniment?.mentor?.displayName?.toUpperCase(),
      },
    };

    await sendEmail(msg);
  } catch (error) {
    console.error({
      message: "Message couldn't be send.",
      error,
      accompaniment,
    });
  }
}

async function getAccompaniment(doc: functions.firestore.DocumentSnapshot) {
  return (doc.exists) ? doc.data() : null;
}

export const mailAccompanimentReview = functions.firestore
  .document('accompaniments/{accompanimentId}')
  .onCreate(async (document, _) => {
    const accompaniment = await getAccompaniment(document);

    if (!!accompaniment) {
      await sendEmailToUser(accompaniment);
    }
  });
