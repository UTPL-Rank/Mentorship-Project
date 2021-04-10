import { SGMUser } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { UserCollectionRef } from "./user-collection-ref";


/**
 * User Document
 * ==============================================================
 *
 * @author Bruno Esparza
 *
 * Get the firestore document of a user
 *
 * @param id identifier of the user
 */
export function UserDocumentRef<T = SGMUser.readDto>(id: string): firestore.DocumentReference<T> {
    return UserCollectionRef<T>().doc(id);
}