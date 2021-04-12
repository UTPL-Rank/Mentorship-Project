import { ChatCollectionRef } from "./chat-collection-ref";

export async function FindChatExists(senderUsername: string, receiverUsername: string): Promise<boolean> {
    const query = ChatCollectionRef().where('participantsUsernames', 'array-contains', senderUsername);
    const posibilites = await query.get();

    const foundOneCoincidence = posibilites.docs
        .map(doc => doc.exists ? doc.data() : null)
        .some(chat => chat?.participantsUsernames.includes(receiverUsername));

    return foundOneCoincidence;
}