import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  lockClosedOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tarjeta-pago',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './tarjeta-pago.page.html',
  styleUrls: ['./tarjeta-pago.page.scss']
})
export class TarjetaPagoPage {

  numeroTarjeta = '';
  nombreTarjeta = '';
  vencimiento = '';
  cvv = '';

  subtotal = 0;
  delivery = 0;

  constructor(
    public router: Router
  ) {

    addIcons({
      arrowBackOutline,
      lockClosedOutline
    });

  }

  ionViewWillEnter() {

    const carrito =
      JSON.parse(
        localStorage.getItem('carrito') || '[]'
      );

    this.subtotal =
      carrito.reduce(
        (total: number, item: any) =>
          total +
          Number(item.precio) * item.cantidad,
        0
      );

    this.delivery =
      Number(
        localStorage.getItem('deliveryTotal')
      ) || 5;

  }

  volver() {
    window.history.back();
  }

  pagar() {
    this.router.navigate(['/pedido-confirmado']);
  }

  get total() {
    return this.subtotal + this.delivery;
  }

}