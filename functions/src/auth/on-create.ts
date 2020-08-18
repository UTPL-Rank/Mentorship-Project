import * as functions from 'firebase-functions';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { authentication, dbFirestore, sendEmail } from '../utils/utils';
import { BASE_URL, DEFAULT_EMAIL_SEND } from '../utils/variables';

function isUTPLEmail({ email }: UserRecord): boolean {
  return !!email?.includes('@utpl.edu.ec');
}

async function disableAccount({ uid }: UserRecord) {
  await authentication.updateUser(uid, { disabled: true });
  await authentication.revokeRefreshTokens(uid);
}

async function sendWelcomeEmail({ email, displayName }: UserRecord) {
  const msg = {
    to: email,
    from: DEFAULT_EMAIL_SEND,
    templateId: 'd-96289fbd340b496abc31564942b80575',
    dynamic_template_data: {
      displayName,
      url: BASE_URL,
    },
  };
  await sendEmail(msg);
}

async function assignCustomClaimsIfExist({ email, uid }: UserRecord) {
  if (!email) return;

  const doc = dbFirestore.collection('claims').doc(email);
  const claimsSnap = await doc.get();

  if (claimsSnap.exists) {
    const claims = claimsSnap.data() as object;
    await authentication.setCustomUserClaims(uid, claims);
    // await auth.revokeRefreshTokens(uid);
  }
}

export const assignNewUserClaims = functions.auth.user().onCreate(async (user, _) => {
  if (isUTPLEmail(user)) {
    await assignCustomClaimsIfExist(user);
    await sendWelcomeEmail(user);
  } else {
    await disableAccount(user);
  }
});
