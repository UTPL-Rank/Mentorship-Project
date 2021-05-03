import * as functions from 'firebase-functions';
import { CreateChatUpdateLastMessageDto, GetChat, NotifyChatParticipantsNewMessages, UpdateChatLastMessage } from '../../shared/chat';
import { ValidMessage } from '../../shared/message';
import { dbFirestore } from '../../utils/utils';

export const HandleNewMessageSended = functions.firestore
    .document('chats/{chatId}/messages/{messageId}')
    .onCreate(async (document, context) => {

        // function context information
        const batch = dbFirestore.batch();
        const chatId: string = context.params.chatId;

        const message = ValidMessage(document.data());                      // last message sended

        const chat = await GetChat(chatId);                                 // get chat required information
        const chatUpdateDto = CreateChatUpdateLastMessageDto(message);      // payload to update chat information

        UpdateChatLastMessage(batch, chatId, chatUpdateDto);                // Update information of chat with last message sended
        NotifyChatParticipantsNewMessages(batch, chat, message);            // Notify new message received

        await batch.commit();
    });



