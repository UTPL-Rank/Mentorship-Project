import { firestore } from "firebase-admin";
import { dbFirestore } from "./utils";

type User = any;
type UserProtectedDocument = any;

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
function UserDocument(username: string): firestore.DocumentReference<User> {
    return UsersCollection().doc(username);
}

/**
 * User Protected Information Document
 * ==============================================================
 * 
 * @author Bruno Esparza
 * 
 * Get the firestore document of the protected information of the user
 * 
 * @param username identifier of the user
 */
function UserProtectedDocument(username: string): firestore.DocumentReference<UserProtectedDocument> {
    return UserDocument(username).collection('account-configuration').doc('protected-information');
}

/**
 * Save Messaging Token
 * ==================================================================
 * 
 * @author Bruno Esparza
 * 
 * Save a token in the user protected information
 * 
 * @param username identifier of the user
 * @param token messaging token to be saved
 */
export async function AddUserMessagingToken(username: string, token: string): Promise<void> {
    const protectedDoc = UserProtectedDocument(username);
    const data = {
        tokens: firestore.FieldValue.arrayUnion(token),
    };

    await protectedDoc.set(data, { merge: true });
}

/**
 * Remove Messaging Token
 * ==================================================================
 * 
 * @author Bruno Esparza
 * 
 * Remove a messaging token from the user protected information
 * 
 * @param username identifier of the user
 * @param token messaging token to be saved
 */
export async function RemoveUserMessagingToken(username: string, token: string): Promise<void> {
    const protectedDoc = UserProtectedDocument(username);
    const data = {
        tokens: firestore.FieldValue.arrayRemove(token),
    };
    await protectedDoc.set(data, { merge: true });
}