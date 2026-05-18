import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { getAuth, updateProfile } from '@angular/fire/auth';

@Component({
  selector: 'app-nombre-usuario',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './nombre-usuario.page.html',
  styleUrls: ['./nombre-usuario.page.scss']
})
export class NombreUsuarioPage {

  nombre = '';
  apellido = '';

  constructor(private router: Router) {}

  onBackgroundClick(event: MouseEvent) {

    const target = event.target as HTMLElement;

    if (
      target.tagName !== 'INPUT' &&
      target.tagName !== 'BUTTON'
    ) {
      event.preventDefault();
    }

  }

  async continuar() {

    if (!this.nombre || !this.apellido) {

      alert('Completa los datos');

      return;

    }

    const nombreCompleto =
      `${this.nombre} ${this.apellido}`.trim();

    const auth = getAuth();

    const user = auth.currentUser;

    // 🔥 GUARDAR POR UID
    if (user) {

      localStorage.setItem(
        `nombre_${user.uid}`,
        nombreCompleto
      );

    }

    // 🔥 ACTUALIZAR FIREBASE
    try {

      if (user) {

        await updateProfile(user, {
          displayName: nombreCompleto
        });

      }

    } catch (error) {

      console.log(error);

    }

    this.router.navigate([
      '/fecha-nacimiento'
    ]);

  }

}