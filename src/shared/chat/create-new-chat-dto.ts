import { SGMChat, SGMUser } from "@utpl-rank/sgm-helpers";
import { ChatParticipant } from "@utpl-rank/sgm-helpers/models/chat/chat-participant";
import { firestore } from "firebase-admin";
import { GenerateId } from "../utils/generate-id";

export function CreateNewChatDto(sender: SGMUser.readDto, receiver: SGMUser.readDto): SGMChat.functions.createDto {
    const id = GenerateId();

    const senderDto: ChatParticipant = {
        displayName: sender.displayName,
        email: sender.email,
        uid: sender.uid,
        username: sender.username ?? sender.email.split('@')[0]
    };

    const receiverDto: ChatParticipant = {
        displayName: receiver.displayName,
        email: receiver.email,
        uid: receiver.uid,
        username: receiver.username ?? receiver.email.split('@')[0]
    };

    const chat: SGMChat.functions.createDto = {
        disabled: false,
        lastMessage: null,
        participants: [senderDto, receiverDto],
        participantsUid: [sender.uid, receiver.uid],
        id,
        lastActivity: firestore.FieldValue.serverTimestamp(),
    };

    return chat;
}