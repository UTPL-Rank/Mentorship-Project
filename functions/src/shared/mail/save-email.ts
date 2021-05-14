import { firestore } from "firebase-admin";
import { UserDocumentRef } from "../user";
import { EmailDTO } from "./email-dto";
import { GeneralEmail } from "./general-email";
import { MailConfig } from "./mail-config";

export class SaveEmail<T> {

    private _emailCollection: firestore.CollectionReference<EmailDTO>;

    private _email: Readonly<EmailDTO>;

    /**
     * Create a new task to save an email
     * 
     * @param username identifier of who user should receive this email
     * @param email The email kind to be sended to the users
     */
    public constructor(
        readonly username: string,
        readonly email: GeneralEmail<T>,
    ) {
        this._emailCollection = UserDocumentRef(username).collection('mails') as firestore.CollectionReference<EmailDTO>;;

        const {
            id = this._emailCollection.doc().id,
            sended = false,
            from = MailConfig.mentorshipEmail,
            to,
            subject,
            html,
            sendedDate = null
        } = email.mail();

        if (!to || !subject || !html)
            throw new Error("Missing attributes in mail");

        this._email = { id, sended, sendedDate, from, to, subject, html } as const;
    }

    public async save(): Promise<void> {
        await this._emailCollection.doc(this._email.id).set(this._email);
    }

    public saveSynced(batch: firestore.WriteBatch): void {
        const notificationRef = this._emailCollection.doc(this._email.id);
        batch.set(notificationRef, this._email);
    }

}
