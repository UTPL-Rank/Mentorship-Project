import { SGMMentor } from "@utpl-rank/sgm-helpers";
import { MentorDocumentRef } from "./mentor-document-ref";

export async function Mentor(id: string): Promise<SGMMentor.readDTO | null> {
    const docRef = MentorDocumentRef(id);
    const mentorSnap = await docRef.get();

    return mentorSnap.exists ? mentorSnap.data() as SGMMentor.readDTO : null;
}