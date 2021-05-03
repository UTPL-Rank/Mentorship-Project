import { createTransport } from 'nodemailer';
import * as nodemailer from "nodemailer/lib/mailer";
import { EmailDTO } from './email-dto';
import { MailConfig } from './mail-config';

/**
 * (DO NOT USE) Mailer
 * ========================================
 *
 * This class sends email using nodemailer.
 *
 * @internal this method should be used only by the mail trigger, be careful not to send emails
 * through this method
 *
 * @author Bruno Esparza
 *
 * @param mail email content, and configuration
 */
export class Mailer {

    private static _instance: Mailer | null = null;

    private _client: nodemailer;

    private constructor() {
        this._client = createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: MailConfig.mentorshipEmail,
                pass: MailConfig.mentorshipPassword,
            },
            tls: { ciphers: 'SSLv3' }
        });
    }

    public static get instance(): Mailer {
        if (!this._instance)
            this._instance = new this();

        return this._instance;
    }

    public async send(mail: EmailDTO): Promise<void> {
        await this._client.sendMail(mail);
    }

}
