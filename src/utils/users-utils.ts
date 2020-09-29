import { firestore } from "firebase-admin";
import { dbFirestore } from "./utils";

type User = any;

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
 * Add User Messaging Topic
 * ==================================================================
 * 
 * @author Bruno Esparza
 * 
 * Save the topics the user has subscribed to
 * 
 * @param username identifier of the user
 * @param topics the topics the user subscribed to
 */
export async function AddUserMessagingTopic(username: string, ...topics: Array<string>): Promise<void> {
    const userDoc = UserDocument(username);
    const data = {
        notificationTopics: firestore.FieldValue.arrayUnion(topics),
    };

    await userDoc.set(data, { merge: true });
}

/**
 * Remove User Messaging Topic
 * ==================================================================
 * 
 * @author Bruno Esparza
 * 
 * Remove a messaging topic from the user notifications topics
 * 
 * @param username identifier of the user
 * @param topics the topics the user unsubscribed to
 */
export async function RemoveUserMessagingTopic(username: string, ...topics: Array<string>): Promise<void> {
    const userDoc = UserDocument(username);
    const data = {
        notificationTopics: firestore.FieldValue.arrayRemove(topics),
    };
    await userDoc.set(data, { merge: true });
}

// /**
//  * User Protected Information Document
//  * ==============================================================
//  * 
//  * @author Bruno Esparza
//  * 
//  * Get the firestore document of the protected information of the user
//  * 
//  * @param username identifier of the user
//  */
// function UserProtectedDocument(username: string): firestore.DocumentReference<UserProtectedDocument> {
//     return UserDocument(username).collection('account-configuration').doc('protected-information');
// }