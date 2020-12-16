import { firestore } from "firebase-admin";
import { MailTemplates } from "../mail/mail-templates";
import { Mailer } from "../shared/mail/mail";
import { MailConfig } from "../shared/mail/mail-config";
import { UserDocument } from "./users-utils";
import nodemailer = require("nodemailer/lib/mailer");

export interface SendMailDTO<T> {
    subject: string;
    to: string;
    templateId: keyof typeof MailTemplates;
    templateData: T;
}
export type CreateEmailDTO = nodemailer.Options & {
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

function CreateSaveMailDTO<T>(username: string, data: SendMailDTO<T>) {
    const mailingCollection = MailingCollection(username);
    const id = mailingCollection.doc().id;
    const html = MailTemplates[data.templateId](data.templateData as any);
    const mail: CreateEmailDTO = {
        id,
        sended: false,
        from: MailConfig.mentorshipEmail,
        to: data.to,
        subject: data.subject,
        html,
    };

    return mail;
}

export async function ProgramSendEmail<T>(username: string, data: SendMailDTO<T>): Promise<void> {
    const mailingCollection = MailingCollection(username);
    const mail = CreateSaveMailDTO<T>(username, data);

    await mailingCollection.add(mail);
}

export function ProgramSendEmailSync<T>(username: string, data: SendMailDTO<T>, batch: firestore.WriteBatch): void {
    const mailingCollection = MailingCollection(username);
    const mail = CreateSaveMailDTO<T>(username, data);

    batch.set(mailingCollection.doc(), mail, { merge: false });
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
export async function _SendEmail(username: string, mailId: string, mail: CreateEmailDTO): Promise<void> {
    // send email
    await Mailer.instance.send(mail);

    // update mail since it has been already sended
    const mailDoc = MailingDocument(username, mailId);
    await mailDoc.update({ sended: true });
}