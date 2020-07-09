import { firestore } from 'firebase';

export interface Notification {
  id: string;
  message: string;
  displayName: string;
  redirect: string;
  read: boolean;
  time: firestore.Timestamp;
}
