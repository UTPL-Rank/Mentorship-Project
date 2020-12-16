import * as functions from 'firebase-functions';

/**
 * Expose mail configuration from the current running env
 */
export namespace MailConfig {

    /**
     * Default mail account to send emails 
     */
    export const mentorshipEmail: string = functions.config().nodemail.user;

    /**
     * Password used to access the default mail account
     */
    export const mentorshipPassword: string = functions.config().nodemail.pass;

}