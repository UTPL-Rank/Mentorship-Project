import nodemailer = require("nodemailer/lib/mailer");

export interface EmailDTO extends nodemailer.Options {
    id: string,
    sended: boolean,
    sendedDate: Date | null
}
