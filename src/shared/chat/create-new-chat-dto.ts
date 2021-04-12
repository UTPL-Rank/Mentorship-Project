import { SGMChat, SGMIntegrator, SGMMentor, SGMUser } from "@utpl-rank/sgm-helpers";
import { ChatParticipant } from "@utpl-rank/sgm-helpers/models/chat/chat-participant";
import { firestore } from "firebase-admin";
import { GenerateId } from "../utils/generate-id";

export function CreateNewChatDtoFromUser(sender: SGMUser.readDto, receiver: SGMUser.readDto): SGMChat.functions.createDto {
    const id = GenerateId();

    const senderDto: ChatParticipant = {
        displayName: sender.displayName,
        email: sender.email,
        username: sender.username ?? sender.email.split('@')[0]
    };

    const receiverDto: ChatParticipant = {
        displayName: receiver.displayName,
        email: receiver.email,
        username: receiver.username ?? receiver.email.split('@')[0]
    };

    const chat: SGMChat.functions.createDto = {
        disabled: false,
        lastMessage: null,
        participants: [senderDto, receiverDto],
        participantsUsernames: [senderDto.username, receiverDto.username],
        id,
        lastActivity: firestore.FieldValue.serverTimestamp(),
    };

    return chat;
}

export function CreateNewChatDtoFromMentorIntegrator(sender: SGMMentor.readDTO, receiver: SGMIntegrator.readDTO): SGMChat.functions.createDto {
    const id = GenerateId();

    const senderDto: ChatParticipant = {
        displayName: sender.displayName,
        email: sender.email,
        username: sender.email.split('@')[0]
    };

    const receiverDto: ChatParticipant = {
        displayName: receiver.displayName,
        email: receiver.email,
        username: receiver.email.split('@')[0]
    };

    const chat: SGMChat.functions.createDto = {
        disabled: false,
        lastMessage: null,
        participants: [senderDto, receiverDto],
        participantsUsernames: [senderDto.username, receiverDto.username],
        id,
        lastActivity: firestore.FieldValue.serverTimestamp(),
    };

    return chat;
}