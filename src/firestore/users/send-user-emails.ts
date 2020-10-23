import * as functions from 'firebase-functions';
import { _SendEmail } from '../../utils/mailing-utils';

/**
 * Send user mails
 * ===============================================================
 * 
 * @author Bruno Esparza
 * 
 * Send mails to users, the mails send are sended every time a document is created
 * in the mails collection
 * 
 */
export const SendUserMails = functions.firestore
    .document('users/{username}/mails/{mailId}')
    .onCreate(async (payload, { params }) => {
        const { username, mailId } = params;
        const mail = payload.data();
        await _SendEmail(username, mailId, mail);
    });