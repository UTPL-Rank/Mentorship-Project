import { SGMIntegrator } from "@utpl-rank/sgm-helpers";
import { IntegratorsDocumentRef } from "./integrator-document-ref";

export async function Integrator(id: string): Promise<SGMIntegrator.readDTO | null> {
    const docRef = IntegratorsDocumentRef(id);
    const integratorSnap = await docRef.get();

    return integratorSnap.exists ? integratorSnap.data() as SGMIntegrator.readDTO : null;
}