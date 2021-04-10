import { SGMUser } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { UserCollectionRef } from "./user-collection-ref";

export function UserDocumentRef<T = SGMUser.readDto>(id: string): firestore.DocumentReference<T> {
    return UserCollectionRef<T>().doc(id);
}