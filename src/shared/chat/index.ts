import { SGMChat, SGMMessage, SGMNotification } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { dbFirestore } from "../../utils/utils";
import { SaveNotifications } from "../notifications/save-notification";

export function CreateChatUpdateLastMessageDto(lastMessage: SGMMessage.functions.readDto): SGMChat.functions.updateLastMessageDto {
    const payload: SGMChat.functions.updateLastMessageDto = {
        lastMessage,
        lastActivity: firestore.FieldValue.serverTimestamp()
    }

    return payload;
}

export function UpdateChatLastMessage(batch: firestore.WriteBatch, chatId: string, validUpdate: SGMChat.functions.updateLastMessageDto): void {
    const chatRef = dbFirestore.collection('chats').doc(chatId);
    batch.update(chatRef, validUpdate);
}

export async function GetChat(chatId: string): Promise<SGMChat.functions.readDto> {
    const chatRef = dbFirestore.collection('chats').doc(chatId);
    const chatSnap = await chatRef.get();
    const chat = chatSnap.exists ? chatSnap.data() as SGMChat.functions.readDto : null;

    if (!chat)
        throw new Error("Chat information not loaded");

    return chat;
}

function CreateNewMessageNotification(message: SGMMessage.functions.readDto, chatId: string): Partial<SGMNotification.createDTO> {
    return {
        name: 'Nuevo Mensaje',
        message: `${message.sender.displayName.toUpperCase()} envió un mensaje.`,
        redirect: `https://sgmentores.web.app/panel-control/chat/${chatId}`,
    };
}

export function NotifyChatParticipantsNewMessages(batch: firestore.WriteBatch, chat: SGMChat.functions.readDto, message: SGMMessage.functions.readDto,) {
    const sendNotificationParticipants = chat.participants.filter(participant => participant.username !== message.sender.username);

    // send notification
    const notification: Partial<SGMNotification.createDTO> = CreateNewMessageNotification(message, chat.id);

    // notifications tasks
    sendNotificationParticipants.forEach(participant => {
        const saver = new SaveNotifications(participant.username, notification);
        saver.saveSynced(batch);
    });
}