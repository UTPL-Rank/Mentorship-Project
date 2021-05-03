import { SGMMentor } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { MentorCollectionRef } from "./mentor-collection-ref";

export function MentorDocumentRef<T = SGMMentor.readDTO>(id: string): firestore.DocumentReference<T> {
    return MentorCollectionRef<T>().doc(id);
}