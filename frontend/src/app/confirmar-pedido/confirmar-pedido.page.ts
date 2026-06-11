import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  locationOutline,
  walletOutline,
  bagHandleOutline,
  documentTextOutline,
  chevronForwardOutline,
  lockClosedOutline,
  timeOutline,
  closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-confirmar-pedido',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './confirmar-pedido.page.html',
  styleUrls: ['./confirmar-pedido.page.scss']
})
export class ConfirmarPedidoPage {

  carrito: any[] = [];
  notaPedido = '';

  metodoPago = 'Efectivo';
  metodoDescripcion = 'Pagarás en la entrega';

  showNotaModal = false;
  notaTemp = '';

  delivery = 5.00;

  direccionUsuario = 'Av. Los Constructores 1234';
  distritoUsuario = 'Huamanga, Ayacucho';

  deliveryDisponible = true;
  mensajeDelivery = '';
  tiempoEstimado = '30 - 45 min';

  // Local Kimsa
  localLat = -13.1603;
  localLng = -74.2258;

  constructor(public router: Router) {
    addIcons({
      arrowBackOutline,
      locationOutline,
      walletOutline,
      bagHandleOutline,
      documentTextOutline,
      chevronForwardOutline,
      lockClosedOutline,
      timeOutline,
      closeOutline
    });
  }

  ionViewWillEnter() {
    this.carrito =
      JSON.parse(localStorage.getItem('carrito') || '[]');

    this.notaPedido =
      localStorage.getItem('notaPedido') || '';

    this.cargarMetodoPago();
    this.cargarDireccion();
    this.calcularDelivery();
  }

  cargarDireccion() {
    this.direccionUsuario =
      localStorage.getItem('direccionUsuario') ||
      'Av. Los Constructores 1234';

    this.distritoUsuario =
      localStorage.getItem('distritoUsuario') ||
      'Huamanga, Ayacucho';
  }

  calcularDelivery() {
    const lat = Number(localStorage.getItem('latitudUsuario'));
    const lng = Number(localStorage.getItem('longitudUsuario'));

    const textoDireccion =
      `${this.direccionUsuario} ${this.distritoUsuario}`.toLowerCase();

    const estaEnAyacucho =
      textoDireccion.includes('ayacucho') ||
      textoDireccion.includes('huamanga');

    if (!estaEnAyacucho || !lat || !lng) {
      this.deliveryDisponible = false;
      this.delivery = 0;
      this.mensajeDelivery = 'Delivery no disponible fuera de Huamanga - Ayacucho';
      return;
    }

    const distancia = this.calcularDistanciaKm(
      this.localLat,
      this.localLng,
      lat,
      lng
    );

if (distancia <= 2) {

  this.delivery = 3;
  this.tiempoEstimado = '20 - 30 min';

} else if (distancia <= 4) {

  this.delivery = 5;
  this.tiempoEstimado = '30 - 40 min';

} else if (distancia <= 6) {

  this.delivery = 7;
  this.tiempoEstimado = '40 - 50 min';

} else if (distancia <= 8) {

  this.delivery = 9;
  this.tiempoEstimado = '50 - 60 min';

} else {

  this.deliveryDisponible = false;
  this.delivery = 0;

  this.mensajeDelivery =
    'Tu dirección está fuera de la zona de delivery';

  return;
}

    this.deliveryDisponible = true;
    this.mensajeDelivery = `Delivery calculado a ${distancia.toFixed(1)} km del local`;
    localStorage.setItem(
  'deliveryTotal',
  String(this.delivery)
);
  }

  calcularDistanciaKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6371;
    const dLat = this.gradosARadianes(lat2 - lat1);
    const dLon = this.gradosARadianes(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.gradosARadianes(lat1)) *
      Math.cos(this.gradosARadianes(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  gradosARadianes(grados: number) {
    return grados * (Math.PI / 180);
  }

  cargarMetodoPago() {
    this.metodoPago =
      localStorage.getItem('metodoPago') || 'Efectivo';

    switch (this.metodoPago) {
      case 'Yape':
        this.metodoDescripcion =
          'Paga fácilmente con tu app Yape';
        break;

      case 'Plin':
        this.metodoDescripcion =
          'Paga fácilmente con tu app Plin';
        break;

      case 'Tarjeta de crédito / débito':
        this.metodoDescripcion =
          'Visa, Mastercard y más';
        break;

      case 'Efectivo':
      default:
        this.metodoDescripcion =
          'Pagarás en la entrega';
        break;
    }
  }

  volver() {
    window.history.back();
  }

  editarCarrito() {
  this.router.navigate(['/carrito']);
}

  abrirNota() {
    this.notaTemp = this.notaPedido;
    this.showNotaModal = true;
  }

  cerrarNota() {
    this.showNotaModal = false;
  }

  guardarNota() {
    this.notaPedido =
      this.notaTemp.trim();

    localStorage.setItem(
      'notaPedido',
      this.notaPedido
    );

    this.showNotaModal = false;
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

  confirmarPedido() {
    if (!this.deliveryDisponible) {
      alert(this.mensajeDelivery);
      return;
    }

    if (this.metodoPago === 'Yape') {
      this.router.navigate(['/pago-yape']);
      return;
    }

    if (this.metodoPago === 'Plin') {
      this.router.navigate(['/pago-plin']);
      return;
    }

    if (
  this.metodoPago ===
  'Tarjeta de crédito / débito'
) {
  this.router.navigate(['/tarjeta-pago']);
  return;
}

    if (this.metodoPago === 'Efectivo') {
      this.router.navigate(['/pedido-confirmado']);
      return;
    }

  }

}