import { SGMIntegrator } from "@utpl-rank/sgm-helpers";
import { firestore } from "firebase-admin";
import { dbFirestore } from "../../utils/utils";

export function IntegratorCollectionRef<T = SGMIntegrator.readDTO>(): firestore.CollectionReference<T> {
    return dbFirestore.collection('integrators') as firestore.CollectionReference<T>;
}