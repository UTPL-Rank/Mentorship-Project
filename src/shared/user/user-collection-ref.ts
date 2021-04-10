import { SGMUser } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { dbFirestore } from "../../utils/utils";

export function UserCollectionRef<T = SGMUser.readDto>(): firestore.CollectionReference<T> {
    return dbFirestore.collection('users') as firestore.CollectionReference<T>;
}