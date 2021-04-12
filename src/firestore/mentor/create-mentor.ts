import { SGMChat, SGMMentor } from '@utpl-rank/sgm-helpers';
import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { ChatDocumentRef } from '../../shared/chat/chat-document-ref';
import { CreateNewChatDtoFromMentorIntegrator } from '../../shared/chat/create-new-chat-dto';
import { ClaimsDocumentRef, SGMClaims } from '../../shared/claims';
import { ValidIntegrator } from '../../shared/integrator';
import { ValidMentor } from '../../shared/mentor';
import { UsernameFromEmail } from '../../utils/users-utils';
import { dbFirestore } from '../../utils/utils';

export interface MentorClaims extends SGMClaims {
    isMentor: true;
    mentorId: string;
    integratorId?: string;
}

/**
 * New mentor is created
 * ===============================================================
 * 
 * @author Bruno Esparza
 * 
 * On every new mentor created do:
 * - assign claims to the user claims
 * - Create the respective chat with the coordinator
 */
const _OnCreateMentor = async (payload: QueryDocumentSnapshot, _: functions.EventContext) => {
    const mentor = payload.data() as SGMMentor.readDTO;
    const batch = dbFirestore.batch();


    const mentorUsername = UsernameFromEmail(mentor.email);
    const receiverUsername = UsernameFromEmail(mentor.integrator.email);

    await CreateChat(mentorUsername, receiverUsername, batch);

    AssignClaims(mentor, mentorUsername, batch);

    await batch.commit();
};

export const OnCreateMentor = functions
    .firestore
    .document('mentors/{mentorId}')
    .onCreate(_OnCreateMentor);

/** 
 * assign claims
 */
function AssignClaims(mentor: SGMMentor.readDTO, senderUsername: string, batch: FirebaseFirestore.WriteBatch) {
    const claims: MentorClaims = { isMentor: true, mentorId: mentor.id };
    const claimsDoc = ClaimsDocumentRef<MentorClaims>(senderUsername);

    batch.create(claimsDoc, claims);
}

/**
 * create chat
 */
async function CreateChat(senderUsername: string, receiverUsername: string, batch: FirebaseFirestore.WriteBatch) {
    const [sender, receiver] = await Promise.all([ValidMentor(senderUsername), ValidIntegrator(receiverUsername)]);
    const chatDto = CreateNewChatDtoFromMentorIntegrator(sender, receiver);
    const chatDocRef = ChatDocumentRef<SGMChat.functions.createDto>(chatDto.id);
    batch.create(chatDocRef, chatDto);
}
