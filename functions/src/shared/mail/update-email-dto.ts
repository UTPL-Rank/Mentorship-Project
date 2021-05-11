import {EmailDTO} from "./email-dto";

export interface UpdateEmailDTO extends Pick<EmailDTO, "id" | "sended" | "sendedDate"> {
    // id: string,
    sended: true,
    sendedDate: Date
}
