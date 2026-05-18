import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { keyOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-email-auth',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './email-auth.page.html',
  styleUrls: ['./email-auth.page.scss'],
})
export class EmailAuthPage {

  constructor(private router: Router) {
    addIcons({
      keyOutline,
      arrowBackOutline
    });
  }

  // 🔥 SIN ANIMACIÓN (regresa directo, sin slide)
  goBack() {
    this.router.navigate(['/cuenta'], {
      replaceUrl: true
    });
  }

  goLogin() {
    this.router.navigate(['/login-email']);
  }

  goRegister() {
    this.router.navigate(['/register-email']);
  }
}