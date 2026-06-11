import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  chevronForwardOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './metodo-pago.page.html',
  styleUrls: ['./metodo-pago.page.scss']
})
export class MetodoPagoPage {

  carrito: any[] = [];

  delivery = 0;

  metodoSeleccionado = 'Yape';

  metodos = [
    {
      nombre: 'Yape',
      descripcion: 'Paga fácilmente con tu app Yape',
      icono: 'assets/iconos/yape.png'
    },

    {
      nombre: 'Tarjeta de crédito / débito',
      descripcion: 'Visa, Mastercard y más',
      icono: 'assets/iconos/tarjeta.png'
    },

  ];

  constructor(public router: Router) {
    addIcons({
      arrowBackOutline,
      chevronForwardOutline,
      shieldCheckmarkOutline
    });
  }

  ionViewWillEnter() {
    this.carrito =
      JSON.parse(localStorage.getItem('carrito') || '[]');

    this.metodoSeleccionado =
      localStorage.getItem('metodoPago') || 'Yape';

      this.delivery =
  Number(localStorage.getItem('deliveryTotal')) || 5;
  }

  

  seleccionarMetodo(nombre: string) {
    this.metodoSeleccionado = nombre;
  }

  continuar() {

  localStorage.setItem(
    'metodoPago',
    this.metodoSeleccionado
  );

  this.router.navigate(['/confirmar-pedido']);

}

  volver() {
    window.history.back();
  }

  get subtotal() {
    return this.carrito.reduce(
      (total, item) =>
        total + Number(item.precio) * item.cantidad,
      0
    );
  }

  get total() {
    return this.subtotal + this.delivery;
  }

}