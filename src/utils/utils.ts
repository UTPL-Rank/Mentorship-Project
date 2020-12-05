import * as admin from 'firebase-admin/lib';


export const app = admin.initializeApp();
export const dbFirestore = app.firestore();
export const authentication = admin.auth();
export const fcm = admin.messaging();