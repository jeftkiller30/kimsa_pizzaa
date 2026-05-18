import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';

import { getAuth, updateProfile } from '@angular/fire/auth';

import {
  chevronBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-editar-nombre',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-nombre.page.html',
  styleUrls: ['./editar-nombre.page.scss']
})
export class EditarNombrePage {

  nombre: string = '';
  apellido: string = '';

  constructor(private router: Router) {

    addIcons({
      chevronBackOutline
    });

    const user = getAuth().currentUser;

    // 🔥 RECUPERAR POR UID
    if (user) {

      const nombreGuardado =
        localStorage.getItem(
          `nombre_${user.uid}`
        );

      if (nombreGuardado) {

        const partes =
          nombreGuardado.split(' ');

        this.nombre =
          partes[0] || '';

        this.apellido =
          partes.slice(1).join(' ') || '';

      }

    }

  }

  goBack() {

    this.router.navigate(['/mi-perfil']);

  }

  async guardar() {

    const nombreCompleto =
      `${this.nombre} ${this.apellido}`.trim();

    const user = getAuth().currentUser;

    // 🔥 GUARDAR POR UID
    if (user) {

      localStorage.setItem(
        `nombre_${user.uid}`,
        nombreCompleto
      );

      // 🔥 ACTUALIZAR FIREBASE
      try {

        await updateProfile(user, {
          displayName: nombreCompleto
        });

      } catch (error) {

        console.log(error);

      }

    }

    this.router.navigate(['/mi-cuenta']);

  }

}