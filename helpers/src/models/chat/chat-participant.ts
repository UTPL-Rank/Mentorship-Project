import { SGMUser } from "../user/user";

/**
 * minimum information required to identify all the participants in a chat
 */
export interface ChatParticipant extends Pick<
    SGMUser.readDto,
    'displayName' | 'email' | 'username'
> {
    displayName: string;
    email: string;
    username: string;
}