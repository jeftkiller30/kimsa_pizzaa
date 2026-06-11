import { Component, OnInit, OnDestroy } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { addIcons } from 'ionicons';
import { filter } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';

import {
  home,
  homeOutline,
  receipt,
  receiptOutline,
  person,
  personOutline,
  bicycleOutline,
  storefrontOutline,
  lockClosedOutline,
  cartOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HomePage implements OnInit, OnDestroy {

  pizzas: any[] = [];
  bebidas: any[] = [];
  alitas: any[] = [];
  piqueos: any[] = [];

  cantidadTotal = 0;

  private bannerInterval: any;

  activeBanner = 0;

  touchStartX = 0;
  touchEndX = 0;

  activeTab: string = 'home';

  tipoEntrega: string = 'delivery';

  showLoginModal: boolean = false;

  constructor(
    private firestore: Firestore,
    private router: Router
  ) {

    addIcons({
      home,
      homeOutline,
      receipt,
      receiptOutline,
      person,
      personOutline,
      bicycleOutline,
      storefrontOutline,
      lockClosedOutline,
      cartOutline
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        const url = this.router.url;

        if (url.includes('home')) {
          this.activeTab = 'home';
        }

        if (url.includes('carrito')) {
          this.activeTab = 'carrito';
        }

        if (url.includes('mis-pedidos')) {
          this.activeTab = 'pedidos';
        }

        if (
          url.includes('cuenta') ||
          url.includes('mi-cuenta')
        ) {
          this.activeTab = 'cuenta';
        }

      });

  }

  categories = [
    { name: 'Promos', icon: 'assets/iconos/promos.png', active: false },
    { name: 'Combos', icon: 'assets/iconos/combos.png', active: false },
    { name: 'Pizzas', icon: 'assets/iconos/pizzas.png', active: true },
    { name: 'Pastas', icon: 'assets/iconos/pastas.png', active: false },
    { name: 'Alitas', icon: 'assets/iconos/alitas.png', active: false },
    { name: 'Piqueos', icon: 'assets/iconos/piqueos.png', active: false },
    { name: 'Bebidas', icon: 'assets/iconos/bebidas.png', active: false },
    { name: 'Cervezas', icon: 'assets/iconos/cervezas.png', active: false }
  ];

  banners = [
    { image: 'assets/banners/banner1.png', title: '', tag: '' },
    { image: 'assets/banners/banner2.png', title: '', tag: '' },
    { image: 'assets/banners/banner3.png', title: '', tag: '' }
  ];

  ngOnInit() {

    const productosRef =
      collection(this.firestore, 'productos');

    collectionData(productosRef, { idField: 'id' })
      .subscribe((data: any[]) => {

        this.pizzas =
          data.filter(p => p.categoria === 'pizzas');

        this.bebidas =
          data.filter(p => p.categoria === 'bebidas');

          this.alitas =
          data.filter(p => p.categoria === 'alitas');

        this.piqueos =
          data.filter(p => p.categoria === 'piqueos');

      });

    this.startInterval();

  }

  ionViewWillEnter() {

    const carrito =
      JSON.parse(
        localStorage.getItem('carrito') || '[]'
      );

    this.cantidadTotal =
      carrito.reduce(
        (total: number, item: any) =>
          total + item.cantidad,
        0
      );

  }

  ngOnDestroy() {

    clearInterval(this.bannerInterval);

  }

  startInterval() {

    this.bannerInterval = setInterval(() => {

      this.activeBanner =
        this.activeBanner < this.banners.length - 1
          ? this.activeBanner + 1
          : 0;

    }, 5000);

  }

  resetInterval() {

    clearInterval(this.bannerInterval);

    this.startInterval();

  }

  onTouchStart(event: any) {

    this.touchStartX =
      event.changedTouches[0].screenX;

  }

  onTouchMove(event: any) {

    this.touchEndX =
      event.changedTouches[0].screenX;

  }

  onTouchEnd() {

    if (this.touchStartX - this.touchEndX > 50) {

      this.nextBanner();

      this.resetInterval();

    }

    if (this.touchEndX - this.touchStartX > 50) {

      this.prevBanner();

      this.resetInterval();

    }

  }

  nextBanner() {

    if (this.activeBanner < this.banners.length - 1) {
      this.activeBanner++;
    }

  }

  prevBanner() {

    if (this.activeBanner > 0) {
      this.activeBanner--;
    }

  }

  goToBanner(index: number) {

    this.activeBanner = index;

  }

  selectCategory(cat: any) {

    this.categories.forEach(c => c.active = false);

    cat.active = true;

    this.router.navigate([
      '/categoria',
      cat.name.toLowerCase()
    ]);

  }

  goToCategory(cat: string) {

    this.router.navigate([
      '/categoria',
      cat
    ]);

  }

  openProduct(p: any) {

    this.router.navigate(
      ['/producto-detalle'],
      {
        state: {
          producto: p
        }
      }
    );

  }

  setTab(tab: string) {

    this.activeTab = tab;

    const auth = getAuth();

    const user = auth.currentUser;

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

        if (user) {

          this.activeTab = 'pedidos';

          this.router.navigate(['/mis-pedidos']);

        } else {

          this.showLoginModal = true;

          document.body.style.overflow = 'hidden';

        }

        break;

      case 'cuenta':

        this.activeTab = 'cuenta';

        if (user) {

          this.router.navigate(['/mi-cuenta']);

        } else {

          this.showLoginModal = true;

          document.body.style.overflow = 'hidden';

        }

        break;

    }

  }

  closeModal() {

    this.showLoginModal = false;

    document.body.style.overflow = 'auto';

  }

  goLogin() {

    this.showLoginModal = false;

    document.body.style.overflow = 'auto';

    this.router.navigate(['/cuenta']);

  }

  setEntrega(tipo: string) {

    this.tipoEntrega = tipo;

  }

  irHome() {

    this.showLoginModal = false;

    document.body.style.overflow = 'auto';

    this.router.navigateByUrl(
      '/',
      { skipLocationChange: true }
    ).then(() => {

      this.router.navigate(['/home']);

    });

  }

}