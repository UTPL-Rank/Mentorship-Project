import { SGMUser } from "@utpl-rank/sgm-helpers";
import { UserDocumentRef } from "./user-document-ref";

export async function User(id: string): Promise<SGMUser.readDto | null> {
    const docRef = UserDocumentRef(id);
    const userSnap = await docRef.get();

    return userSnap.exists ? userSnap.data() as SGMUser.readDto : null;
}