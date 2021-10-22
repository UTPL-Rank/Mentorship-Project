import * as functions from 'firebase-functions';
import {GeneralEmail} from '../shared/mail/general-email';
import {SaveEmail} from '../shared/mail/save-email';
import {OneMentor} from '../utils/mentors-utils';
import {CurrentPeriod} from '../utils/period-utils';
import {UsernameFromEmail} from '../utils/users-utils';
import {dbFirestore} from '../utils/utils';
import {BASE_URL} from '../utils/variables';
import {RememberRegisterAccompanimentEmail} from '../shared/mail/templates/remember-register-accompaniment-email/remember-register-accompaniment-email';
// import {NeverRegisterAccompanimentEmail} from "../shared/mail/templates/remember-register-accompaniment-email/never-register-accompaniment-email";
// import {ValidateAccompanimentEmail} from "../shared/mail/templates/validate-accompaniment-email/validate-accompanimet-email";
// import {WelcomeEmail} from "../shared/mail/templates/welcome-email/welcome-email";

/**
 * At 00:00 on day-of-month 5 and 20 in November, December, January, February, May, June, July, and August.
 */
const CRON_EVERY_MONTH = '0 0 5,20 11,12,1,2,5,6,7,8 *';

const MENTOR_ID_TEST_1 = 'abr21-ago21-odmendoza'
// const MENTOR_ID_TEST_2 = 'testing-dmmedina7'

export const testNotifyMentors =
    functions
        .pubsub
        .schedule(CRON_EVERY_MONTH)
        .onRun(async _ => {
            console.log('Testing sending mails');

            const oneMentor = await Promise.all([
                OneMentor(MENTOR_ID_TEST_1),
                // OneMentor(MENTOR_ID_TEST_2)
            ]);

            const {id: periodId} = await CurrentPeriod();

            const batch = dbFirestore.batch();

            // Notify Mentors With No Recent Accompaniments
            oneMentor.forEach(mentor => {
                if (mentor){
                    const username = UsernameFromEmail(mentor.email);

                    // Remember Register Accompaniment Email
                    const emailTemplate = new RememberRegisterAccompanimentEmail({
                        redirectUrl: `${BASE_URL}/panel-control/${periodId}/acompañamientos/nuevo/${mentor.id}`,
                        mentorName: mentor.displayName.toUpperCase(),
                        lastAccompanimentDate: mentor.stats.lastAccompaniment?.toDate()
                    } as any );

                    // Never Register Accompaniment Email
                    // const emailTemplate = new NeverRegisterAccompanimentEmail({
                    //     redirectUrl: `${BASE_URL}/panel-control/${periodId}/acompañamientos/nuevo/${mentor.id}`,
                    //     mentorName: mentor.displayName.toUpperCase(),
                    // });

                    // Validate Accompaniment Email
                    // const emailTemplate = new ValidateAccompanimentEmail({
                    //     redirectUrl: `${BASE_URL}/panel-control/${periodId}/acompañamientos/nuevo/${mentor.id}`,
                    //     mentorName: mentor.displayName.toUpperCase(),
                    //     studentName: 'ESTUDIANTE MENTOR',
                    //     accompanimentId: '123'
                    // });

                    // Welcome Email
                    // const emailTemplate = new WelcomeEmail({
                    //     displayName: mentor.displayName.toUpperCase(),
                    //     url: 'www.google.com',
                    //     redirectUrl: `${BASE_URL}/panel-control/${periodId}/acompañamientos/nuevo/${mentor.id}`
                    // });

                    const genericEmail = new GeneralEmail(
                        mentor.email,
                        'Recuerda registrar el acompañamiento mentorial',
                        emailTemplate,
                    );
                    const saver = new SaveEmail(username, genericEmail);
                    saver.saveSynced(batch);
                }
            });

            return await batch.commit();
        });
