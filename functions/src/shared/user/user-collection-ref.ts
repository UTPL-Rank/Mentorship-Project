import { SGMUser } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { dbFirestore } from "../../utils/utils";

/**
 * Users Collection
 * =============================================================
 *
 * @author Bruno Esparza
 *
 * Get the firestore collection of users
 */
export function UserCollectionRef<T = SGMUser.readDto>(): firestore.CollectionReference<T> {
    return dbFirestore.collection('users') as firestore.CollectionReference<T>;
}