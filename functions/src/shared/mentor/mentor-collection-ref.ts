import { SGMMentor } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { dbFirestore } from "../../utils/utils";

export function MentorCollectionRef<T = SGMMentor.readDTO>(): firestore.CollectionReference<T> {
    return dbFirestore.collection('mentors') as firestore.CollectionReference<T>;
}