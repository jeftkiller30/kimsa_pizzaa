import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';

import { getAuth } from 'firebase/auth';

import {
  chevronBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-editar-telefono',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-telefono.page.html',
  styleUrls: ['./editar-telefono.page.scss']
})
export class EditarTelefonoPage {

  telefono: string = '';

  constructor(private router: Router) {

    addIcons({
      chevronBackOutline
    });

    const user = getAuth().currentUser;

    // 🔥 LEER TELÉFONO POR UID
    if (user) {

      const telefonoGuardado =
        localStorage.getItem(
          `telefono_${user.uid}`
        );

      if (telefonoGuardado) {

        this.telefono =
          telefonoGuardado;

      }

    }

  }

  goBack() {

    this.router.navigate([
      '/mi-perfil'
    ]);

  }

  guardar() {

    const user = getAuth().currentUser;

    // 🔥 GUARDAR TELÉFONO POR UID
    if (user) {

      localStorage.setItem(
        `telefono_${user.uid}`,
        this.telefono
      );

    }

    this.router.navigate([
      '/mi-perfil'
    ]);

  }

  // 🔥 SOLO NÚMEROS
  soloNumeros(event: any) {

    const valor =
      event.target.value.replace(
        /\D/g,
        ''
      );

    this.telefono = valor;

    event.target.value = valor;

  }

}