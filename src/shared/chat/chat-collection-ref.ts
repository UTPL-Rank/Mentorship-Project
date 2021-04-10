import { SGMChat } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { dbFirestore } from "../../utils/utils";

export function ChatCollectionRef<T = SGMChat.readDto>(): firestore.CollectionReference<T> {
    return dbFirestore.collection('chats') as firestore.CollectionReference<T>;
}