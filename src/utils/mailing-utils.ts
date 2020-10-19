import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import * as sgMail from '@sendgrid/mail';
import { firestore } from "firebase-admin";
import * as functions from 'firebase-functions';
import { UserDocument } from "./users-utils";

const SEND_GRID_API_KEY = functions.config().sendgrid.apikey;
export const DEFAULT_EMAIL_SEND = 'proyectomentores@utpl.edu.ec';

sgMail.setApiKey(SEND_GRID_API_KEY);

export async function ProgramSendEmail(username: string, data: MailDataRequired): Promise<void> {
    const mailingCollection = UserMailingCollection(username);
    const id = mailingCollection.doc().id;

    await mailingCollection.add(Object.assign(data, {
        from: DEFAULT_EMAIL_SEND, id
    }));
}

export const SendEmail = ProgramSendEmail;

/**
 * User Mailing Collection
 * ==============================================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore collection of sending emails to a user
 * 
 * @param username identifier of the user
 */
function UserMailingCollection(username: string): firestore.CollectionReference<MailDataRequired> {
    const userDoc = UserDocument(username);
    const mailCollection = userDoc.collection('mails') as firestore.CollectionReference<MailDataRequired>;
    return mailCollection
}

/**
 * (DO NOT USE) Send Mail
 * ========================================
 * 
 * Send emails to users using the send grid library
 * 
 * @internal this method should be used only by the mail trigger, be careful not to send emails
 * through this method, instead use the `ProgramSendEmail` or the `SendEmail`
 * 
 * @author Bruno Esparza
 * 
 * @param mail email content, and configuration
 * 
 */
export async function _SendEmail(mail: MailDataRequired): Promise<void> {
    await sgMail.send(mail);
}