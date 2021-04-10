import { ChatCollectionRef } from "./chat-collection-ref";

export async function FindChatExists(senderUid: string, receiverUid: string): Promise<boolean> {
    const query = ChatCollectionRef().where('participantsUid', 'array-contains', senderUid);
    const posibilites = await query.get();

    const foundOneCoincidence = posibilites.docs
        .map(doc => doc.exists ? doc.data() : null)
        .some(chat => chat?.participantsUid.includes(receiverUid));

    return foundOneCoincidence;
}