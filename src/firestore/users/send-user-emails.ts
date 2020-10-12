import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import * as sgMail from '@sendgrid/mail';
import * as functions from 'firebase-functions';

const SEND_GRID_API_KEY = functions.config().sendgrid.apikey;
export const DEFAULT_EMAIL_SEND = 'proyectomentores@utpl.edu.ec';

sgMail.setApiKey(SEND_GRID_API_KEY);

/**
 * Send user mails
 * ===============================================================
 * 
 * @author Bruno Esparza
 * 
 * Send mails to users, the mails send are sended every time a document is created
 * in the mails collection
 * 
 */
export const SendUserMails = functions.firestore
    .document('users/{username}/mails/{mailId}')
    .onCreate(async (payload, _) => {
        const mail = payload.data() as MailDataRequired;

        mail.from = DEFAULT_EMAIL_SEND;

        return await sgMail.send(mail);
    });