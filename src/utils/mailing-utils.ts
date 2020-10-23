import { firestore } from "firebase-admin";
import * as functions from 'firebase-functions';
import { createTransport } from 'nodemailer';
import { MailTemplates } from "../mail/mail-templates";
import { UserDocument } from "./users-utils";
import Mail = require("nodemailer/lib/mailer");

const user = functions.config().nodemail.user;
const pass = functions.config().nodemail.pass;

const client = createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { ciphers: 'SSLv3' }
});

export interface SendMailDTO<T = { [key: string]: any }> {
    subject: string;
    to: string;
    templateId: keyof typeof MailTemplates;
    templateData: T;
}
export type CreateEmailDTO = Mail.Options & {
    id: string,
    sended: false,
}

function MailingCollection(username: string): firestore.CollectionReference<CreateEmailDTO> {
    const mailCollection = UserDocument(username).collection('mails') as firestore.CollectionReference<CreateEmailDTO>;
    return mailCollection
}

function MailingDocument(username: string, mailId: string): firestore.DocumentReference<CreateEmailDTO> {
    const mailCollection = MailingCollection(username).doc(mailId);
    return mailCollection
}

export async function ProgramSendEmail(username: string, data: SendMailDTO): Promise<void> {
    const mailingCollection = MailingCollection(username);
    const id = mailingCollection.doc().id;

    let html = MailTemplates[data.templateId];

    for (const key in data.templateData)
        if (key in data.templateData) {
            const value = data.templateData[key];
            const pattern = new RegExp(`(\{\{\{${key}\}\}\})/g`);
            html = html.replace(pattern, value);
        }

    const mail: CreateEmailDTO = {
        id,
        sended: false,
        from: user,
        to: data.to,
        subject: data.subject,
        html,
    };

    await mailingCollection.add(mail);
}

export const SendEmail = ProgramSendEmail;


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
export async function _SendEmail(username: string, mailId: string, mail: Mail.Options): Promise<void> {
    // send email
    await client.sendMail(mail);

    // update mail since it has been already sended
    const mailDoc = MailingDocument(username, mailId);
    await mailDoc.update({ sended: true });
}