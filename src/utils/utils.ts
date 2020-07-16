import * as sgMail from '@sendgrid/mail';
import * as admin from 'firebase-admin/lib';
import * as functions from 'firebase-functions';


export const app = admin.initializeApp();
export const firestore = app.firestore();
export const auth = admin.auth();


export async function sendEmail(msg: any) {
  try {
    const SEND_GRID_API_KEY = functions.config().sendgrid.apikey;

    sgMail.setApiKey(SEND_GRID_API_KEY);
    return await sgMail.send(msg);
  } catch (e) {
    console.log('SEND_GRID_API_KEY not configured');
    return await Promise.resolve(null);
  }
}
