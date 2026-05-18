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
  pricetag,
  pricetagOutline,
  receipt,
  receiptOutline,
  person
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

  constructor(private router: Router) {

    addIcons({
      personOutline,
      lockClosedOutline,
      locationOutline,
      cardOutline,
      chevronForwardOutline,

      home,
      homeOutline,
      pricetag,
      pricetagOutline,
      receipt,
      receiptOutline,
      person
    });

  }

  ionViewWillEnter() {

    this.activeTab = 'cuenta';

    const user = getAuth().currentUser;

    // 🔥 LEER NOMBRE POR UID
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

        this.router.navigate(['/home']);

        break;

      case 'cupones':

        console.log('Cupones');

        break;

      case 'pedidos':

        console.log('Pedidos');

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