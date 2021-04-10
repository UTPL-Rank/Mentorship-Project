import { firestore } from "firebase-admin";
import { UserDocumentRef } from "../user";

export type SGMClaims = Record<string, any>;

export function ClaimsDocumentRef<T = SGMClaims>(id: string): firestore.DocumentReference<T> {
    return UserDocumentRef(id).collection('account-configuration').doc('claims') as firestore.DocumentReference<T>;
}