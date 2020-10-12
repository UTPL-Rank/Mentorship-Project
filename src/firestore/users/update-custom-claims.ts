import * as functions from 'firebase-functions';
import { GetUserEmailFromUsername, UserClaims } from '../../utils/users-utils';
import { authentication } from '../../utils/utils';

/**
 * Update User Custom Claims
 * ===============================================================
 * 
 * @author Bruno Esparza
 * 
 * Update user Custom claims in the authentication module. with the data stored in the 
 * firestore claims document
 * 
 * This function runs every time the claims documente is updated
 * 
 */
export const UpdateUserCustomClaims = functions.firestore
    .document('users/{username}/account-configuration/claims')
    .onUpdate(async (payload, { params }) => {
        const username = params.username;
        const newClaims = payload.after.data() as UserClaims;
        const email = GetUserEmailFromUsername(username);
        const { uid } = await authentication.getUserByEmail(email);

        await authentication.setCustomUserClaims(uid, newClaims);
    });