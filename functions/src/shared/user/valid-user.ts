import { SGMUser } from "@utpl-rank/sgm-helpers";
import { User } from "./user";

export async function ValidUser(id: string): Promise<SGMUser.readDto> {
    const user = await User(id);

    if (user)
        return user;

    throw new Error(`User with id: ${id} not found`);
}