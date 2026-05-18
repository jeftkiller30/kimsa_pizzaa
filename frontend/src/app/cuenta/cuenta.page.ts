import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { mailOutline } from 'ionicons/icons';

import { AuthService } from '../services/auth';
import { Auth } from '@angular/fire/auth';

import { getAdditionalUserInfo } from 'firebase/auth';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {

  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private auth: Auth
  ) {
    addIcons({
      mailOutline
    });
  }

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.isLoggedIn = true;
      }
    });
  }

  continuarInvitado() {
    localStorage.setItem('activeTab', 'home');
    this.router.navigate(['/home']);
  }

  async loginGoogle() {
    try {
      const result = await this.authService.loginGoogle();
      const user = result.user;

      const info = getAdditionalUserInfo(result);
      const esNuevoUsuario = info?.isNewUser === true;

      if (user?.email) {
        localStorage.setItem('emailUsuario', user.email);
      }

      if (esNuevoUsuario) {
        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('fechaNacimiento');
        localStorage.removeItem(`onboarding_${user.uid}`);

        this.router.navigate(['/nombre-usuario']);
        return;
      }

      if (user?.displayName) {
        localStorage.setItem('nombreUsuario', user.displayName);
      }

      this.router.navigate(['/home']);

    } catch (error) {
      console.log(error);
      alert('No se pudo iniciar sesión con Google');
    }
  }

  async loginFacebook() {
    try {
      await this.authService.loginFacebook();
      this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
      alert('No se pudo iniciar sesión con Facebook');
    }
  }

  async loginEmail(email: string, password: string) {
    try {
      await this.authService.loginEmail(email, password);
      this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
      alert('Correo o contraseña incorrectos');
    }
  }

  goEmailAuth() {
    this.router.navigate(['/email-auth']);
  }

}