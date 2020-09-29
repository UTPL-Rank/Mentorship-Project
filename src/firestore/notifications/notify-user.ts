import admin = require('firebase-admin');
import * as functions from 'firebase-functions';
import { SendNotificationToUser } from '../../utils/notifiactions-utils';
import { BASE_URL } from '../../utils/variables';

/**
 * Notify User new Notification
 * ===============================================================
 * 
 * @author Bruno Esparza
 * 
 * Send push notifications to users saying that they have received a new notification
 * by using their tokens
 * 
 * This function runs every time a new notification document is created
 * 
 */
export const NotifyUsers = functions.firestore
    .document('users/{username}/notifications/{notificationId}')
    .onCreate(async (snapshot, { params }) => {
        const notification = snapshot.data();
        const username = params.username;

        const payload: admin.messaging.MessagingPayload = {
            notification: {
                title: notification.name,
                body: notification.message,
                clickAction: `${BASE_URL}${notification.redirect}`,
            }
        };

        try {
            console.log({ username, payload });

            await SendNotificationToUser(username, payload);
        } catch (error) {
            console.log(error.message);
        }
    });