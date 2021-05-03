import { SGMMessage } from "@utpl-rank/sgm-helpers";

export function ValidMessage(payload: SGMMessage.functions.readDto | firebase.firestore.DocumentData | null): SGMMessage.functions.readDto {
    if (!payload)
        throw new Error(`Empty message payload: ${JSON.stringify(payload)}`);

    const message: SGMMessage.functions.readDto = {
        accompaniment: payload.accompaniment,
        asset: payload.asset,
        banned: payload.banned,
        date: payload.date,
        id: payload.id,
        kind: payload.kind,
        sender: payload.sender,
        text: payload.text,
    };

    if (Object.values(message).includes(undefined))
        throw new Error(`Invalid data in payload: ${JSON.stringify(payload)}`);

    return message;
}