import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';

import {
  restaurantOutline,
  homeOutline,
  cart,
  receiptOutline,
  personOutline,
  addOutline,
  removeOutline,
  trashOutline,
  chevronForwardOutline,
  closeOutline,
  documentTextOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss']
})
export class CarritoPage {

  carrito: any[] = [];

  showNotaModal = false;

  notaPedido = '';

  notaTemp = '';

  constructor(public router: Router) {
    addIcons({
      restaurantOutline,
      homeOutline,
      cart,
      receiptOutline,
      personOutline,
      addOutline,
      removeOutline,
      trashOutline,
      chevronForwardOutline,
      closeOutline,
      documentTextOutline
    });
  }

  ionViewWillEnter() {
    this.cargarCarrito();

    this.notaPedido =
      localStorage.getItem('notaPedido') || '';
  }

  cargarCarrito() {
    this.carrito =
      JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  guardarCarrito() {
    localStorage.setItem(
      'carrito',
      JSON.stringify(this.carrito)
    );
  }

  aumentar(item: any) {
    item.cantidad++;
    this.guardarCarrito();
  }

  disminuir(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      this.quitar(item);
    }

    this.guardarCarrito();
  }

  quitar(item: any) {
    this.carrito =
      this.carrito.filter(p => p.id !== item.id);

    this.guardarCarrito();
  }

  abrirNota() {
    this.notaTemp = this.notaPedido;
    this.showNotaModal = true;
  }

  cerrarNota() {
    this.showNotaModal = false;
  }

  guardarNota() {
    this.notaPedido = this.notaTemp.trim();

    localStorage.setItem(
      'notaPedido',
      this.notaPedido
    );

    this.showNotaModal = false;
  }

  eliminarNota() {
    this.notaPedido = '';
    this.notaTemp = '';

    localStorage.removeItem('notaPedido');

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
    return this.subtotal;
  }

  get cantidadTotal() {
    return this.carrito.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }

  verMenu() {
    this.router.navigate(['/home']);
  }

}