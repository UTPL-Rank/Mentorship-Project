import { createTransport } from 'nodemailer';
import * as nodemailer from "nodemailer/lib/mailer";
import { CreateEmailDTO } from '../../utils/mailing-utils';
import { MailConfig } from './mail-config';

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

    public async send(mail: CreateEmailDTO): Promise<void> {
        await this._client.sendMail(mail);
    }

}
