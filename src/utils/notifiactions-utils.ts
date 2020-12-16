import { SGMNotification } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { SaveNotifications } from "../shared/notifications/save-notification";
import { UserDocument } from "./users-utils";
import { fcm } from "./utils";
import admin = require("firebase-admin");

/**
 * Add User Messaging Topic
 * ==================================================================
 * 
 * @author Bruno Esparza
 * 
 * Save the topic the user has subscribed to
 * 
 * @param username identifier of the user
 * @param topic the topic the user subscribed to
 */
async function AddUserMessagingTopic(username: string, topic: string): Promise<void> {
    const userDoc = UserDocument(username);
    const data = {
        notificationTopics: admin.firestore.FieldValue.arrayUnion(topic),
    };

    await userDoc.set(data, { merge: true });
}

/**
 * Remove User Messaging Topic
 * ==================================================================
 * 
 * @author Bruno Esparza
 * 
 * Remove a messaging topic from the user notifications topics
 * 
 * @param username identifier of the user
 * @param topic the topic the user unsubscribed to
 */
async function RemoveUserMessagingTopic(username: string, topic: string): Promise<void> {
    const userDoc = UserDocument(username);
    const data = {
        notificationTopics: firestore.FieldValue.arrayRemove(topic),
    };
    await userDoc.set(data, { merge: true });
}

export function GetUserTopic(username: string): string {
    const topic = `user-${username}`;
    return topic;
}

export async function SubscribeToUserNotifications(username: string, token: string) {
    const topic = GetUserTopic(username);

    await Promise.all([
        fcm.subscribeToTopic(token, topic),
        AddUserMessagingTopic(username, topic),
    ]);
}

export async function UnsubscribeToUserNotifications(username: string, token: string) {
    const topic = GetUserTopic(username);

    await Promise.all([
        fcm.unsubscribeFromTopic(token, topic),
        RemoveUserMessagingTopic(username, topic),
    ]);
}

/**
 * @deprecated
 * @param username 
 */
export function UserNotificationsCollection(username: string): firestore.CollectionReference<SGMNotification.readDTO> {
    const userDoc = UserDocument(username);
    const mailCollection = userDoc.collection('notifications') as firestore.CollectionReference<SGMNotification.readDTO>;
    return mailCollection
}

/** @deprecated */
export async function ProgramNotification(username: string, data: Partial<SGMNotification.createDTO>): Promise<void> {
    const saver = new SaveNotifications(username, data);
    await saver.save();
}

export const SendNotification = ProgramNotification;

/**
 * (DO NOT USE) Send Notification
 * ========================================
 * 
 * Method to send notifications to a specific topic using the fcm library.
 * 
 * @internal should be used only once by the notification trigger, be careful to not 
 * send notifications thought this method, instead use the `SendNotification` or the `ProgramNotification`
 * 
 * @author Bruno Esparza
 * 
 * @param username user name of the user to recibe the notification
 * @param payload notification content
 * 
 */
export async function _SendNotification(username: string, payload: admin.messaging.MessagingPayload): Promise<void> {
    const userTopic = GetUserTopic(username);
    await fcm.sendToTopic(userTopic, payload);
}