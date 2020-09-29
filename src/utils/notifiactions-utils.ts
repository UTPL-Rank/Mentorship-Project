import admin = require("firebase-admin");
import { AddUserMessagingTopic, RemoveUserMessagingTopic } from "./users-utils";
import { fcm } from "./utils";

export function GetUserTopic(username: string): string {
    return username;
}

export async function SubscribeToUserNotifications(username: string, token: string) {
    const topic = GetUserTopic(username);

    await Promise.all([
        fcm.subscribeToTopic(topic, token),
        AddUserMessagingTopic(username, topic),
    ]);
}

export async function UnsubscribeToUserNotifications(username: string, token: string) {
    const topic = GetUserTopic(username);

    await Promise.all([
        fcm.subscribeToTopic(topic, token),
        RemoveUserMessagingTopic(username, topic),
    ]);
}

export async function SendNotificationToUser(username: string, payload: admin.messaging.MessagingPayload): Promise<void> {
    const userTopic = GetUserTopic(username);

    await fcm.sendToTopic(userTopic, payload);
}