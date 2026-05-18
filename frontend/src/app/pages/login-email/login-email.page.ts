import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';
import { arrowBackOutline, eyeOutline } from 'ionicons/icons';

import { AuthService } from '../../services/auth';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login-email',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login-email.page.html',
  styleUrls: ['./login-email.page.scss'],
})
export class LoginEmailPage {

  email: string = '';
  password: string = '';

  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {

    addIcons({
      arrowBackOutline,
      eyeOutline
    });

  }

  goBack() {
    this.router.navigate(['/email-auth']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /* 🔥 LOGIN */
  async login() {

    if (!this.email || !this.password) {
      alert('Completa todos los campos');
      return;
    }

    this.loading = true;

    try {

      /* 🔥 LOGIN FIREBASE */
      await this.authService.loginEmail(
        this.email,
        this.password
      );

      /* 🔥 USUARIO ACTUAL */
      const auth = getAuth();
      const user = auth.currentUser;

      await user?.reload();

      /* 🔥 VERIFICAR EMAIL */
      if (user && !user.emailVerified) {

        alert('Debes verificar tu correo antes de ingresar');

        this.loading = false;
        return;
      }

      /* 🔥 GUARDAR TAB */
      localStorage.setItem('activeTab', 'home');

      /* 🔥 IR HOME */
      this.router.navigate(['/home']);

    } catch (error: any) {

      console.log(error);

      if (error.code === 'auth/user-not-found') {

        alert('Usuario no registrado');

      } else if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {

        alert('Correo o contraseña incorrectos');

      } else if (error.code === 'auth/invalid-email') {

        alert('Correo inválido');

      } else {

        alert(error.message);

      }

    } finally {

      this.loading = false;

    }

  }

}