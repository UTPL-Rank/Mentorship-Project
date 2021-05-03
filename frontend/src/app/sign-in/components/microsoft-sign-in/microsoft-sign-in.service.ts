import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { ISignIn } from '../../models/i-sign-in';
import { IMicrosoftSignInOptions } from './i-microsoft-sign-in-options';

@Injectable({ providedIn: 'root' })
export class MicrosoftSignInService extends ISignIn<IMicrosoftSignInOptions> {

  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly eventLog: AngularFireAnalytics,
  ) { super(); }

  async signIn(options?: IMicrosoftSignInOptions): Promise<void> {

    // early return since no username was provided
    if (!options?.username) {
      alert('No se ingreso un nombre de usuario valido');
      return;
    }

    const username: string = options.username.split('@')[0];

    // proceed to create a new UTPL provider
    const microsoftProvider = new auth.OAuthProvider('microsoft.com');
    microsoftProvider.setCustomParameters({
      prompt: 'login',
      login_hint: `${username}@utpl.edu.ec`,
      tenant: '6eeb49aa-436d-43e6-becd-bbdf79e5077d'
    });

    await this.eventLog.logEvent('sign_an_action', { username });
    return await this.afAuth.signInWithRedirect(microsoftProvider);
  }
}
