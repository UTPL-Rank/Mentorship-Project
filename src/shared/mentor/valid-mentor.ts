import { SGMMentor } from "@utpl-rank/sgm-helpers";
import { Mentor } from "./mentor";

export async function ValidMentor(id: string): Promise<SGMMentor.readDTO> {
    const mentor = await Mentor(id);

    if (mentor)
        return mentor;

    throw new Error(`Mentor with id: ${id} not found`);
}