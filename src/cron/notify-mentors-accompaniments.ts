import * as functions from 'firebase-functions';
import { MailData } from '../mail/mail-templates';
import { ProgramSendEmailSync, SendMailDTO } from '../utils/mailing-utils';
import { ListMentorsWithNoRecentAccompaniments, ListMentorsWithNoRegisteredAccompaniments } from '../utils/mentors-utils';
import { CurrentPeriod } from '../utils/period-utils';
import { dbFirestore } from '../utils/utils';
import { BASE_URL } from '../utils/variables';

/**
 * At 00:00 on day-of-month 10 and 25 in January, February, May, June, July, August, November, and December.
 */
const CRON_EVERY_MONTH = '0 0 10,25 1,2,5,6,7,8,11,12 *';

export const notifyMentorsAccompaniments = functions.pubsub.schedule(CRON_EVERY_MONTH).onRun(async _ => {
    const [noRegisteredAccompaniments, noAccompaniments] = await Promise.all([ListMentorsWithNoRegisteredAccompaniments(), ListMentorsWithNoRecentAccompaniments()]);
    const { id: periodId } = await CurrentPeriod();
    const mentors = [...noRegisteredAccompaniments, ...noAccompaniments];
    const batch = dbFirestore.batch();

    mentors.forEach(mentor => {
        const username = mentor.email;
        const email: SendMailDTO<MailData.RememberToRegisterAccompaniment> = {
            to: mentor.email,
            templateId: 'rememberToRegisterAccompaniment',
            subject: 'Recuerda registrar el acompañamiento mentorial',
            templateData: {
                redirectUrl: `${BASE_URL}/panel-control/${periodId}/acompañamientos/nuevo/${mentor.id}`,
                mentorName: mentor.displayName.toUpperCase(),
            },
        };

        ProgramSendEmailSync<MailData.RememberToRegisterAccompaniment>(username, email, batch);
    });

    return await batch.commit();
});