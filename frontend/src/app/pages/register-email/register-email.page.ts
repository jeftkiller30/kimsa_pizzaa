import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  eyeOutline,
  eyeOffOutline,
  checkmarkCircle,
  closeCircle
} from 'ionicons/icons';

import { AuthService } from '../../services/auth';

// 🔥 Firebase
import { getAuth, sendEmailVerification } from '@angular/fire/auth';

@Component({
  selector: 'app-register-email',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './register-email.page.html',
  styleUrls: ['./register-email.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterEmailPage {

  email = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirm = false;

  passwordBlurred = false;
  emailBlurred = false;
  confirmBlurred = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({
      arrowBackOutline,
      eyeOutline,
      eyeOffOutline,
      checkmarkCircle,
      closeCircle
    });
  }

  ionViewWillEnter() {
    this.resetForm();
  }

  // 🔙 VOLVER
  goBack() {
    this.router.navigate(['/email-auth']);
  }

  // 👁 PASSWORD
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm() {
    this.showConfirm = !this.showConfirm;
  }

  onPasswordFocus() {
    this.passwordBlurred = false;
  }

  onPasswordBlur(event: FocusEvent) {
    const related = event.relatedTarget as HTMLElement;
    const isInput = related && (related.tagName === 'INPUT' || related.tagName === 'BUTTON');
    if (isInput && this.password.length > 0) {
      this.passwordBlurred = true;
    }
  }

  onEmailBlur(event: FocusEvent) {
    const related = event.relatedTarget as HTMLElement;
    const isInput = related && (related.tagName === 'INPUT' || related.tagName === 'BUTTON');
    if (isInput && this.email.length > 0) {
      this.emailBlurred = true;
    }
  }

  onConfirmBlur(event: FocusEvent) {
    const related = event.relatedTarget as HTMLElement;
    const isInput = related && (related.tagName === 'INPUT' || related.tagName === 'BUTTON');
    if (isInput && this.confirmPassword.length > 0) {
      this.confirmBlurred = true;
    }
  }

  onBackgroundClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON') {
      event.preventDefault();
    }
  }

  // 🔍 VALIDACIONES
  isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  hasLength(): boolean {
    return this.password.length >= 8 && this.password.length <= 12;
  }

  hasUpperLower(): boolean {
    return /[a-z]/.test(this.password) && /[A-Z]/.test(this.password);
  }

  hasNumberSpecial(): boolean {
    return /[0-9]/.test(this.password) && /[^A-Za-z0-9]/.test(this.password);
  }

  isValidPassword(): boolean {
    return this.hasLength() && this.hasUpperLower() && this.hasNumberSpecial();
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword && this.confirmPassword.length > 0;
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.showPassword = false;
    this.showConfirm = false;
    this.passwordBlurred = false;
    this.emailBlurred = false;
    this.confirmBlurred = false;
  }

  // 🚀 REGISTRO FINAL (PRO)
  async register() {

    if (
      !this.isValidEmail() ||
      !this.isValidPassword() ||
      !this.passwordsMatch()
    ) {
      alert('Completa los campos correctamente');
      return;
    }

    try {
      // 🔥 crear usuario
      await this.authService.register(this.email, this.password);

      const auth = getAuth();
      const user = auth.currentUser;

      // 🔥 enviar verificación SIN bloquear
      if (user) {
        sendEmailVerification(user).catch(() => {
          console.log('No se pudo enviar verificación');
        });
      }

      // 🔥 IR A SIGUIENTE PANTALLA
      this.router.navigate(['/nombre-usuario']);

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  }
}