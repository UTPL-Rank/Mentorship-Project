import { firestore } from "firebase-admin";
import { UserDocumentRef } from "../user";
import { UpdateEmailDTO } from "./update-email-dto";

export class UpdateEmail {

    private _emailCollection: firestore.CollectionReference<UpdateEmailDTO>;

    /**
     * Create a new task to save an email
     * 
     * @param username identifier of who user should receive this email
     * @param email The email kind to be sended to the users
     */
    public constructor(
        readonly username: string,
        private readonly _email: UpdateEmailDTO,
    ) {
        this._emailCollection = UserDocumentRef(username).collection('mails') as firestore.CollectionReference<UpdateEmailDTO>;
    }

    public async save(): Promise<void> {
        await this._emailCollection.doc(this._email.id).update(this._email);
    }

    public saveSynced(batch: firestore.WriteBatch): void {
        const notificationRef = this._emailCollection.doc(this._email.id);
        batch.update(notificationRef, this._email);
    }
}