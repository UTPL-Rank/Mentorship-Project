import * as admin from 'firebase-admin';

export const app = admin.initializeApp();
export const dbFirestore = app.firestore();
export const dbDatabase = app.database();
export const authentication = admin.auth();
export const fcm = admin.messaging();