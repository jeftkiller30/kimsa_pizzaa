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
      this.validarFlujoUsuario(result);
    } catch (error) {
      console.log(error);
      alert('No se pudo iniciar sesión con Google');
    }
  }

  async loginFacebook() {
    try {
      const result = await this.authService.loginFacebook();
      this.validarFlujoUsuario(result);
    } catch (error) {
      console.log(error);
      alert('No se pudo iniciar sesión con Facebook');
    }
  }

  private validarFlujoUsuario(result: any) {
    const user = result.user;

    if (!user) {
      return;
    }

    const info = getAdditionalUserInfo(result);
    const esNuevoUsuario = info?.isNewUser === true;

    if (user.email) {
      localStorage.setItem('emailUsuario', user.email);
    }

    const nombreKey = `nombre_${user.uid}`;
    const fechaKey = `fecha_${user.uid}`;
    const onboardingKey = `onboarding_${user.uid}`;

    const nombreGuardado = localStorage.getItem(nombreKey);
    const fechaGuardada = localStorage.getItem(fechaKey);
    const onboardingCompleto =
      localStorage.getItem(onboardingKey) === 'true';

    if (
      !esNuevoUsuario &&
      onboardingCompleto &&
      nombreGuardado &&
      fechaGuardada
    ) {
      this.router.navigate(['/home']);
      return;
    }

    if (esNuevoUsuario) {
      localStorage.removeItem(nombreKey);
      localStorage.removeItem(fechaKey);
      localStorage.removeItem(onboardingKey);
      this.router.navigate(['/nombre-usuario']);
      return;
    }

    if (!nombreGuardado) {
      this.router.navigate(['/nombre-usuario']);
      return;
    }

    if (!fechaGuardada) {
      this.router.navigate(['/fecha-nacimiento']);
      return;
    }

    localStorage.setItem(onboardingKey, 'true');
    this.router.navigate(['/home']);
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