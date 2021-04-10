import { SGMUser } from '@utpl-rank/sgm-helpers';
import * as functions from 'firebase-functions';
import { CreateNewUser, DisableAccount, UsernameFromEmail, ValidUTPLEmail } from '../utils/users-utils';


export const assignNewUserClaims = functions.auth.user().onCreate(async (user, _) => {

  const { uid, email, displayName = '', photoURL = '' } = user;

  if (email && ValidUTPLEmail(email)) {
    const username = UsernameFromEmail(email);
    const userDto: SGMUser.functions.createDto = {
      uid,
      email,
      displayName,
      disabled: false,
      photoURL,
      username: UsernameFromEmail(email),
      notificationTopics: []
    };
    await CreateNewUser(username, userDto);
  } else {
    await DisableAccount({ uid });
  }
});
