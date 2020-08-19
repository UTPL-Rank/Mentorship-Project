import * as functions from 'firebase-functions';
import { AddUserMessagingToken, RemoveUserMessagingToken } from '../utils/users-utils';

/**
 * Save Messaging Token
 * ==========================================================
 *
 * @author Bruno Esparza
 *
 * @name SaveMessagingToken callable function name
 *
 * Firebase callable function to save a messaging token in the protected document of a user 
 * to later send notifications to the user 
 *
 * @param username identifier of the user
 * @param token messaging token to be sabed
 */
export const SaveMessagingToken = functions.https.onCall(async (data) => {
    const token = data.token;
    const username = data.username;

    try {
        await AddUserMessagingToken(username, token);
        return true;
    } catch (err) {
        console.error(err.message);
        return false;
    }
});

/**
 * Remove Messaging Token
 * ==========================================================
 *
 * @author Bruno Esparza
 *
 * @name RemoveMessagingToken callable function name
 *
 * Firebase callable function to remove a messaging token in the protected document.
 * Since any user has many tokens, we require the token to remove from user messaging tokens
 *
 * @param username identifier of the user
 * @param token messaging token to be removed
 */
export const RemoveMessagingToken = functions.https.onCall(async (data) => {
    const token = data.token;
    const username = data.username;

    try {
        await RemoveUserMessagingToken(username, token);
        return true;
    } catch (err) {
        console.error(err.message);
        return false;
    }
});
