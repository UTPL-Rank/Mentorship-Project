import { SGMIntegrator } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { IntegratorCollectionRef } from "./integrator-collection-ref";

export function IntegratorsDocumentRef<T = SGMIntegrator.readDTO>(id: string): firestore.DocumentReference<T> {
    return IntegratorCollectionRef<T>().doc(id);
}