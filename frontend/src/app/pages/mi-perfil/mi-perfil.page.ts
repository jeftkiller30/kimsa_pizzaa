import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';

import { getAuth } from 'firebase/auth';

import {
  chevronBackOutline,
  chevronForwardOutline,
  personOutline,
  phonePortraitOutline,
  balloonOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss']
})
export class MiPerfilPage {

  nombreUsuario: string = '';
  telefonoUsuario: string = '';
  fechaNacimiento: string = '';

  constructor(private router: Router) {

    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      personOutline,
      phonePortraitOutline,
      balloonOutline
    });

  }

  ionViewWillEnter() {

    const user = getAuth().currentUser;

    if (user) {

      // 🔥 NOMBRE
      this.nombreUsuario =
        localStorage.getItem(
          `nombre_${user.uid}`
        ) || '';

      // 🔥 TELÉFONO
      this.telefonoUsuario =
        localStorage.getItem(
          `telefono_${user.uid}`
        ) || 'Dato no proporcionado';

      // 🔥 FECHA
      this.fechaNacimiento =
        localStorage.getItem(
          `fecha_${user.uid}`
        ) || '';

    }

  }

  goBack() {

    this.router.navigate(['/mi-cuenta']);

  }

  goEditarNombre() {

    this.router.navigate(['/editar-nombre']);

  }

  goEditarTelefono() {

    this.router.navigate(['/editar-telefono']);

  }

  goEditarFecha() {

    this.router.navigate(['/editar-fecha']);

  }

}