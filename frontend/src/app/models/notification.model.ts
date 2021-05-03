import { firestore } from 'firebase/app';

export interface Notification {
  id: string;
  message: string;
  name: string;
  redirect: string;
  read: boolean;
  time: firestore.Timestamp;
}
