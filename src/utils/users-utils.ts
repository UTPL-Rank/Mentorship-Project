import { firestore } from "firebase-admin";
import { GeneralEmail } from "../shared/mail/general-email";
import { SaveEmail } from "../shared/mail/save-email";
import { WelcomeEmail } from "../shared/mail/templates/welcome-email/welcome-email";
import { authentication, dbFirestore } from "./utils";
import { BASE_URL } from "./variables";

export type User = any;
export type UserClaims = {};

/**
 * Users Collection
 * =============================================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore collection of users
 */
function UsersCollection(): firestore.CollectionReference<User> {
    return dbFirestore.collection('users');
}

/**
 * User Document
 * ==============================================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore document of a user
 * 
 * @param username identifier of the user
 */
export function UserDocument(username: string): firestore.DocumentReference<User> {
    return UsersCollection().doc(username);
}


/**
 * User Claims document
 * ==============================================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore document of custom claims of a user
 * 
 * @param username identifier of the user
 */
function UserClaimsDocument(username: string): firestore.DocumentReference<UserClaims> {
    const userDoc = UserDocument(username);
    const claimsDocument = userDoc.collection('account-configuration').doc('claims') as firestore.DocumentReference<UserClaims>;
    return claimsDocument
}

export async function DisableAccount(account: { uid?: string, username?: string, email?: string }): Promise<void> {

    if (!account.uid && !account.email && !account.username)
        throw new Error("No account reference email, username, or uid was provided");

    let uid = account.uid;

    if (!uid) {
        const email = account.email ?? GetUserEmailFromUsername(account.username as string);
        const user = await authentication.getUserByEmail(email)
        uid = user.uid;
    }

    await authentication.updateUser(uid, { disabled: true });
    await authentication.revokeRefreshTokens(uid);
}

export async function SaveUserInformation(username: string, data: User): Promise<void> {
    const userDoc = UserDocument(username);
    await userDoc.set(data, { merge: true });
}

export async function AssignCustomClaimsToUser(username: string, claims: UserClaims): Promise<void> {
    const claimsDocument = UserClaimsDocument(username);
    await claimsDocument.set(claims, { merge: true });
}

export async function CreateNewUser(username: string, data: User): Promise<void> {
    const userDoc = UserDocument(username);
    const claimsDoc = UserClaimsDocument(username);

    const welcomeTemplate = new WelcomeEmail({
        displayName: data.displayName,
        url: BASE_URL,
    });

    const email = new GeneralEmail(
        data.email,
        'Bienvenido Sistema de Gestión de Mentores - Proyecto Mentores',
        welcomeTemplate
    );

    const saver = new SaveEmail(username, email);

    const batch = dbFirestore.batch();

    saver.saveSynced(batch);
    batch.set(userDoc, data, { merge: false });
    batch.set(claimsDoc, { uid: data.uid }, { merge: true });

    await batch.commit();
}

export function UsernameFromEmail(email: string): string {
    return email.split('@')[0];
}
export function ValidUTPLEmail(email: string): boolean {
    return !!email?.includes('@utpl.edu.ec');
}
export function GetUserEmailFromUsername(username: string): string {
    return `${username}@utpl.edu.ec`
}