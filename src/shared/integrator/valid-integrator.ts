import { SGMIntegrator } from "@utpl-rank/sgm-helpers";
import { Integrator } from "./integrator";

export async function ValidIntegrator(id: string): Promise<SGMIntegrator.readDTO> {
    const integrator = await Integrator(id);

    if (integrator)
        return integrator;

    throw new Error(`Integrator with id: ${id} not found`);
}