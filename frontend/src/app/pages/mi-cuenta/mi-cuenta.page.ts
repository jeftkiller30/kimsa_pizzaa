import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { addIcons } from 'ionicons';

import { getAuth } from 'firebase/auth';

import {
  personOutline,
  lockClosedOutline,
  locationOutline,
  cardOutline,
  chevronForwardOutline,

  home,
  homeOutline,
  receipt,
  receiptOutline,
  person,
  cartOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss']
})
export class MiCuentaPage {

  activeTab: string = 'cuenta';

  nombreUsuario: string = '';
  cantidadTotal = 0;

  constructor(private router: Router) {

    addIcons({
      personOutline,
      lockClosedOutline,
      locationOutline,
      cardOutline,
      chevronForwardOutline,

      home,
      homeOutline,
      receipt,
      receiptOutline,
      person,
      cartOutline
    });

  }

  ionViewWillEnter() {

    this.activeTab = 'cuenta';

    const carrito =
  JSON.parse(localStorage.getItem('carrito') || '[]');

this.cantidadTotal =
  carrito.reduce(
    (total: number, item: any) =>
      total + item.cantidad,
    0
  );

    const user = getAuth().currentUser;

    if (user) {

      const nombreGuardado =
        localStorage.getItem(
          `nombre_${user.uid}`
        );

      this.nombreUsuario =
        nombreGuardado ||
        user.displayName ||
        '';

    }

  }

  setTab(tab: string) {

    this.activeTab = tab;

    switch(tab) {

      case 'home':

        this.activeTab = 'home';

        this.router.navigate(['/home']);

        break;

      case 'carrito':

  this.activeTab = 'carrito';

  this.router.navigate(['/carrito']);

  break;

      case 'pedidos':

        this.activeTab = 'pedidos';

        this.router.navigate(['/mis-pedidos']);

        break;

      case 'cuenta':

        this.activeTab = 'cuenta';

        this.router.navigate(['/mi-cuenta']);

        break;

    }

  }

  goPerfil() {

    this.router.navigate(['/mi-perfil']);

  }

  goSeguridad() {

    this.router.navigate(['/seguridad']);

  }

  goDirecciones() {

    this.router.navigate(['/direcciones']);

  }

}
