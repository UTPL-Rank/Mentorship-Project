import { SGMChat } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { ChatCollectionRef } from "./chat-collection-ref";

export function ChatDocumentRef<T = SGMChat.readDto>(id: string): firestore.DocumentReference<T> {
    return ChatCollectionRef<T>().doc(id);
}