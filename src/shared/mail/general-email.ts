import { EmailDTO } from "./email-dto";
import { IEmailTemplate } from "./templates/i-email-template";

export class GeneralEmail<T> {

    constructor(
        private readonly to: string,
        private readonly subject: string,
        private readonly template: IEmailTemplate<T>,
    ) { }

    public mail(): Partial<EmailDTO> {
        return {
            subject: this.subject,
            to: this.to,
            html: this.template.html(),
        };
    }
}