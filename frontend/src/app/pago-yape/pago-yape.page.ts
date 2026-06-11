import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp
} from '@angular/fire/firestore';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  chevronForwardOutline,
  shieldCheckmarkOutline,
  helpCircleOutline,
  closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-pago-yape',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './pago-yape.page.html',
  styleUrls: ['./pago-yape.page.scss']
})
export class PagoYapePage {

  celular = '';
  codigo = '';

  carrito: any[] = [];
  delivery = 0;
  cargando = false;
  mostrarAyudaYape = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private firestore: Firestore
  ) {
    addIcons({
      arrowBackOutline,
      chevronForwardOutline,
      shieldCheckmarkOutline,
      helpCircleOutline,
      closeOutline
    });
  }

  ionViewWillEnter() {

  this.carrito =
    JSON.parse(localStorage.getItem('carrito') || '[]');

  this.delivery =
    Number(localStorage.getItem('deliveryTotal')) || 5;

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

  get formularioValido() {
    return this.celular.length === 9 && this.codigo.length === 6;
  }

  async completarCompra() {
    if (!this.formularioValido || this.cargando) return;

    this.cargando = true;

    try {
      const response: any = await this.http.post(
        'http://localhost:3000/crear-pago',
        {
          phoneNumber: this.celular,
          otp: this.codigo,
          transaction_amount: this.total,
          email: 'jeffersonhuamani246@gmail.com'
        }
      ).toPromise();

      console.log('RESPUESTA COMPLETA:', response);

alert(
  'Estado: ' +
  response?.status +
  '\nDetalle: ' +
  response?.status_detail
);

if (response?.status === 'approved') {

        await addDoc(collection(this.firestore, 'pedidos'), {
          productos: this.carrito,
          subtotal: this.subtotal,
          delivery: this.delivery,
          total: this.total,

          metodoPago: 'Yape',
          yapeCelular: this.celular,

          mercadoPagoId: response.id,
          estadoPago: response.status,
          detallePago: response.status_detail,

          estado: 'pendiente_validacion',
          direccion: 'Av. Los Constructores 1234',
          fecha: serverTimestamp()
        });

        localStorage.removeItem('carrito');
        localStorage.removeItem('notaPedido');

        alert('✅ Pago aprobado y pedido guardado');

        this.router.navigate(['/mis-pedidos']);

      } else {
        alert('❌ Pago no aprobado');
      }

    } catch (error: any) {
      console.error('ERROR COMPLETO:', error);
      alert('❌ Error: ' + (error?.message || JSON.stringify(error)));
    } finally {
      this.cargando = false;
    }
  }

  soloNumeros(event: any, campo: string) {
    const valor = event.target.value.replace(/[^0-9]/g, '');

    if (campo === 'celular') this.celular = valor;
    if (campo === 'codigo') this.codigo = valor;
  }

  validarNumero(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  abrirAyudaYape() {
  this.mostrarAyudaYape = true;
}

cerrarAyudaYape() {
  this.mostrarAyudaYape = false;
}

}