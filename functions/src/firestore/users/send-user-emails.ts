import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { EmailDTO } from '../../shared/mail/email-dto';
import { Mailer } from '../../shared/mail/mailer';
import { UpdateEmail } from '../../shared/mail/update-email';

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
const _SendUserMails = async (payload: QueryDocumentSnapshot, { params }: functions.EventContext) => {
    const mail = payload.data() as EmailDTO;
    const { username, mailId } = params;

    const transport = Mailer.instance;
    const updater = new UpdateEmail(username, { id: mailId, sended: true, sendedDate: new Date() });

    await transport.send(mail);
    await updater.save();
};

export const SendUserMails = functions
    .runWith({ maxInstances: 2 })
    .firestore
    .document('users/{username}/mails/{mailId}')
    .onCreate(_SendUserMails);
