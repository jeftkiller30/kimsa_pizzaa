import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  cartOutline,
  arrowForwardOutline,
  removeOutline,
  addOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './producto-detalle.page.html',
  styleUrls: ['./producto-detalle.page.scss']
})
export class ProductoDetallePage {

  cantidad = 1;

  cantidadEnCarrito = 0;

  producto: any = {
    nombre: '',
    precio: 0,
    descripcion: '',
    imagen: ''
  };

  constructor(private router: Router) {

    addIcons({
      arrowBackOutline,
      cartOutline,
      arrowForwardOutline,
      removeOutline,
      addOutline
    });

    const productoRecibido =
      history.state.producto;

    if (productoRecibido) {

      this.producto = productoRecibido;

      this.actualizarCantidadCarrito();

    } else {

      this.router.navigate(['/home']);

    }

  }

  volver() {
    window.history.back();
  }

  aumentar() {
    this.cantidad++;
  }

  disminuir() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  get total() {
    return Number(this.producto.precio) * this.cantidad;
  }

  actualizarCantidadCarrito() {

    const carrito =
      JSON.parse(
        localStorage.getItem('carrito') || '[]'
      );

    this.cantidadEnCarrito =
      carrito.reduce(
        (total: number, item: any) =>
          total + item.cantidad,
        0
      );

  }

  agregarCarrito() {

    const carritoActual =
      JSON.parse(
        localStorage.getItem('carrito') || '[]'
      );

    const productoExistente =
      carritoActual.find(
        (item: any) =>
          item.id === this.producto.id
      );

    if (productoExistente) {

      productoExistente.cantidad += this.cantidad;

    } else {

      carritoActual.push({
        ...this.producto,
        cantidad: this.cantidad
      });

    }

    localStorage.setItem(
      'carrito',
      JSON.stringify(carritoActual)
    );

    this.actualizarCantidadCarrito();

    this.router.navigate(['/carrito']);

  }

}