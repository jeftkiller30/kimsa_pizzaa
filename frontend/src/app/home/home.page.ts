import { Component, OnInit, OnDestroy } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { addIcons } from 'ionicons';
import { filter } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';

import {
  home, homeOutline,
  pricetag, pricetagOutline,
  receipt, receiptOutline,
  person, personOutline,
  bicycleOutline,
  storefrontOutline,
  lockClosedOutline
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
      pricetag,
      pricetagOutline,
      receipt,
      receiptOutline,
      person,
      personOutline,
      bicycleOutline,
      storefrontOutline,
      lockClosedOutline
    });

    // 🔥 SINCRONIZAR TABS CON RUTAS
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        const url = this.router.url;

        // 🔥 HOME
        if (url.includes('home')) {
          this.activeTab = 'home';
        }

        // 🔥 CUENTA
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

      });

    this.startInterval();

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

    console.log('Producto:', p);

  }

  // 🔥 MENÚ PRINCIPAL
  setTab(tab: string) {

    this.activeTab = tab;

    const auth = getAuth();

    const user = auth.currentUser;

    switch(tab) {

      case 'home':

        this.activeTab = 'home';

        this.router.navigate(['/home']);

        break;

      case 'cupones':

        console.log('Cupones');

        break;

      case 'pedidos':

        this.showLoginModal = true;

        document.body.style.overflow = 'hidden';

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

  // 🔥 CERRAR MODAL
  closeModal() {

    this.showLoginModal = false;

    document.body.style.overflow = 'auto';

  }

  // 🔥 LOGIN / REGISTRO
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