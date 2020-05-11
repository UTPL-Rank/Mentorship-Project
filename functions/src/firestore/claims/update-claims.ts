import * as admin from 'firebase-admin/lib';
import * as functions from 'firebase-functions';

const auth = admin.auth();

async function setUserClaims(email: string, claims: Object) {
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, claims);
  await auth.revokeRefreshTokens(user.uid);
}

async function removeUserClaims(email: string) {
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, {});
  await auth.revokeRefreshTokens(user.uid);
}

export const updateUserClaims = functions.firestore
  .document('claims/{email}')
  .onWrite(async (change, { params }) => {
    const { email } = params;
    const oldSnap = change.before;
    const newSnap = change.after;

    try {
      if (oldSnap.exists) {
        await removeUserClaims(email);
      }

      if (newSnap.exists) {
        await setUserClaims(email, newSnap.data() as any);
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found')
        console.log(`User ${email} doesn't exist`);
      else
        console.error({
          message: 'An error ocurred assigning claims',
          email,
          error,
        });
    }
  });
