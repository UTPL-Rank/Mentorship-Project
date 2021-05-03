import { SGMNotification } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { UserNotificationsCollection } from "../../utils/notifiactions-utils";

export class SaveNotifications {

    private notificationCollection: firestore.CollectionReference<SGMNotification.createDTO>;

    private notification: Readonly<SGMNotification.createDTO>;

    public constructor(
        private readonly username: string,
        data: Partial<SGMNotification.createDTO>,
    ) {
        this.notificationCollection = UserNotificationsCollection(this.username);

        const {
            id = this.notificationCollection.doc().id,
            read = false,
            message,
            name,
            redirect,
            time = firestore.FieldValue.serverTimestamp()
        } = data;

        if (!message || !name || !redirect)
            throw new Error("Missing attributes in notification");

        this.notification = { id, read, message, name, redirect, time } as const;
    }

    public async save(): Promise<void> {
        await this.notificationCollection.doc(this.notification.id).set(this.notification);
    }

    public saveSynced(batch: firestore.WriteBatch): void {
        const notificationRef = this.notificationCollection.doc(this.notification.id);
        batch.set(notificationRef, this.notification);
    }

}