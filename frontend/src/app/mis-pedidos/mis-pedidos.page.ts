import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy
} from '@angular/fire/firestore';

import { addIcons } from 'ionicons';

import {
  home,
  homeOutline,
  receipt,
  receiptOutline,
  person,
  personOutline,
  bagHandleOutline,
  arrowForwardOutline,
  cartOutline,
  bicycleOutline,
  checkmarkCircleOutline,
  timeOutline,
  locationOutline,
  walletOutline,
  closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss']
})
export class MisPedidosPage {

  activeTab = 'pedidos';

  cantidadTotal = 0;
  cargando = true;

  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  pedidoSeleccionado: any = null;

  filtroActivo = 'todos';

  filtros = [
    { label: 'Todos', value: 'todos' },
    { label: 'Pendientes', value: 'pendiente_validacion' },
    { label: 'En camino', value: 'en_camino' },
    { label: 'Entregados', value: 'entregado' }
  ];

  constructor(
    private router: Router,
    private firestore: Firestore
  ) {
    addIcons({
      home,
      homeOutline,
      receipt,
      receiptOutline,
      person,
      personOutline,
      bagHandleOutline,
      arrowForwardOutline,
      cartOutline,
      bicycleOutline,
      checkmarkCircleOutline,
      timeOutline,
      locationOutline,
      walletOutline,
      closeOutline
    });
  }

  ionViewWillEnter() {
    this.activeTab = 'pedidos';
    this.cargarBadgeCarrito();
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.cargando = true;

    const pedidosRef =
      collection(this.firestore, 'pedidos');

    const pedidosQuery =
      query(
        pedidosRef,
        orderBy('fecha', 'desc')
      );

    collectionData(
      pedidosQuery,
      { idField: 'id' }
    ).subscribe({
      next: (data: any[]) => {

        console.log('🔥 PEDIDOS FIRESTORE:', data);

        this.pedidos = data.map(pedido => ({
          ...pedido,

          productos:
            pedido.productos || [],

          metodoPago:
            pedido.metodoPago || 'Yape',

          total:
            Number(pedido.total || 0),

          subtotal:
            Number(pedido.subtotal || 0),

          delivery:
            Number(pedido.delivery || 0),

          estado:
            pedido.estado || 'pendiente_validacion',

          direccion:
            pedido.direccion || 'Dirección pendiente',

          fechaTexto:
            this.formatearFecha(pedido.fecha),

          estadoTexto:
            this.obtenerEstadoTexto(
              pedido.estado || 'pendiente_validacion'
            ),

          estadoClase:
            this.obtenerEstadoClase(
              pedido.estado || 'pendiente_validacion'
            )
        }));

        this.aplicarFiltros();
        this.cargando = false;
      },

      error: (error) => {
        console.error('❌ ERROR FIRESTORE:', error);
        this.cargando = false;
      }
    });
  }

  cargarBadgeCarrito() {
    const carrito =
      JSON.parse(localStorage.getItem('carrito') || '[]');

    this.cantidadTotal =
      carrito.reduce(
        (total: number, item: any) =>
          total + item.cantidad,
        0
      );
  }

  cambiarFiltro(filtro: string) {
    this.filtroActivo = filtro;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultado = [...this.pedidos];

    if (this.filtroActivo !== 'todos') {
      resultado = resultado.filter(
        pedido => pedido.estado === this.filtroActivo
      );
    }

    this.pedidosFiltrados = resultado;
  }

  abrirDetalle(pedido: any) {
    this.pedidoSeleccionado = pedido;
  }

  cerrarDetalle() {
    this.pedidoSeleccionado = null;
  }

  hacerPrimerPedido() {
    this.router.navigate(['/home']);
  }

  primerasImagenes(pedido: any) {
    return (pedido.productos || []).slice(0, 4);
  }

  productosExtra(pedido: any) {
    const total =
      pedido.productos?.length || 0;

    return total > 4 ? total - 4 : 0;
  }

  obtenerImagenProducto(producto: any) {
    return (
      producto?.imagen ||
      producto?.image ||
      producto?.img ||
      'assets/iconos/pedido.png'
    );
  }

  esBebidaOCerveza(producto: any): boolean {
    const texto =
      (
        producto?.categoria ||
        producto?.tipo ||
        producto?.nombre ||
        this.obtenerImagenProducto(producto)
      ).toString().toLowerCase();

    return (
      texto.includes('bebida') ||
      texto.includes('bebidas') ||
      texto.includes('cerveza') ||
      texto.includes('cervezas')
    );
  }

  get totalPedidos() {
    return this.pedidos.length;
  }

  get pendientes() {
    return this.pedidos.filter(
      p => p.estado === 'pendiente_validacion'
    ).length;
  }

  get enCamino() {
    return this.pedidos.filter(
      p => p.estado === 'en_camino'
    ).length;
  }

  get entregados() {
    return this.pedidos.filter(
      p => p.estado === 'entregado'
    ).length;
  }

  obtenerEstadoTexto(estado: string) {
    switch (estado) {
      case 'pendiente_validacion':
        return 'Pendiente de validación';

      case 'en_camino':
        return 'En camino';

      case 'entregado':
        return 'Entregado';

      case 'cancelado':
        return 'Cancelado';

      default:
        return 'Pendiente';
    }
  }

  obtenerEstadoClase(estado: string) {
    switch (estado) {
      case 'pendiente_validacion':
        return 'status-pending';

      case 'en_camino':
        return 'status-way';

      case 'entregado':
        return 'status-delivered';

      case 'cancelado':
        return 'status-cancelled';

      default:
        return 'status-pending';
    }
  }

  formatearFecha(fecha: any) {
    if (!fecha) {
      return 'Fecha pendiente';
    }

    const date =
      fecha.toDate ? fecha.toDate() : new Date(fecha);

    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' • ' + date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;

    switch (tab) {
      case 'home':
        this.router.navigate(['/home']);
        break;

      case 'carrito':
        this.router.navigate(['/carrito']);
        break;

      case 'pedidos':
        this.router.navigate(['/mis-pedidos']);
        break;

      case 'cuenta':
        this.router.navigate(['/mi-cuenta']);
        break;
    }
  }

}