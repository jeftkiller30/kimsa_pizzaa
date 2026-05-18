import { Injectable } from '@angular/core';

import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
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

    const provider =
      new FacebookAuthProvider();

    return await signInWithPopup(
      this.auth,
      provider
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