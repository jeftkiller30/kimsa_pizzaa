import { Injectable } from '@angular/core';

import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth
  ) {}

  // 🔥 GOOGLE
  async loginGoogle() {

    const provider =
      new GoogleAuthProvider();

    return await signInWithPopup(
      this.auth,
      provider
    );

  }

  // 🔥 FACEBOOK
  async loginFacebook() {

    const { FacebookLogin } =
      await import('@capacitor-community/facebook-login');

    await FacebookLogin.initialize({
      appId: '2240004110138526'
    });

    const result = await FacebookLogin.login({
      permissions: ['public_profile']
    });

    if (!result.accessToken) {
      throw new Error('No se obtuvo token de Facebook');
    }

    const credential = FacebookAuthProvider.credential(
      result.accessToken.token
    );

    return await signInWithCredential(
      this.auth,
      credential
    );

  }

  // 🔥 LOGIN EMAIL
  loginEmail(
    email: string,
    password: string
  ) {

    return signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

  }

  // 🔥 REGISTER
  register(
    email: string,
    password: string
  ) {

    return createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

  }

  // 🔥 LOGOUT
  logout() {

    return signOut(this.auth);

  }

  // 🔥 SEND CODE
  sendCode(email: string) {

    return fetch(
      'http://localhost:3000/send-code',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ email })
      }
    );

  }

  // 🔥 VERIFY CODE
  verifyCode(
    email: string,
    code: string
  ) {

    return fetch(
      'http://localhost:3000/verify-code',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          code
        })
      }
    ).then(res => res.json());

  }

}