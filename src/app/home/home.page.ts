import { Component, OnInit, OnDestroy } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

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
  private bannerInterval: any; // ✅ DENTRO de la clase

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

  activeBanner = 0;
  touchStartX = 0;
  touchEndX = 0;

  constructor(
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    // 🔥 Firebase
    const productosRef = collection(this.firestore, 'productos');
    collectionData(productosRef, { idField: 'id' }).subscribe((data: any[]) => {
      this.pizzas = data.filter(p => p.categoria === 'pizzas');
      this.bebidas = data.filter(p => p.categoria === 'bebidas');
      console.log('Pizzas:', this.pizzas);
      console.log('Bebidas:', this.bebidas);
    });

    // 🔥 Auto-play banner cada 5 segundos
    this.startInterval();
  }

  ngOnDestroy() {
    clearInterval(this.bannerInterval); // ✅ Limpia al salir
  }

  // 🔥 Inicia el intervalo
  startInterval() {
    this.bannerInterval = setInterval(() => {
      this.activeBanner = this.activeBanner < this.banners.length - 1
        ? this.activeBanner + 1
        : 0;
    }, 5000);
  }

  // 🔥 Reinicia el intervalo al hacer swipe
  resetInterval() {
    clearInterval(this.bannerInterval);
    this.startInterval();
  }

  // 🔥 Categorías
  selectCategory(cat: any) {
    this.categories.forEach(c => c.active = false);
    cat.active = true;
    this.router.navigate(['/categoria', cat.name.toLowerCase()]);
  }

  goToCategory(cat: string) {
    this.router.navigate(['/categoria', cat]);
  }

  // 🔥 Producto
  openProduct(p: any) {
    console.log('Producto:', p);
  }

  // 🔥 Banner touch
  onTouchStart(event: any) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchMove(event: any) {
    this.touchEndX = event.changedTouches[0].screenX;
  }

  onTouchEnd() {
    if (this.touchStartX - this.touchEndX > 50) {
      this.nextBanner();
      this.resetInterval(); // ✅ Reinicia el timer
    }
    if (this.touchEndX - this.touchStartX > 50) {
      this.prevBanner();
      this.resetInterval(); // ✅ Reinicia el timer
    }
  }

  nextBanner() {
    if (this.activeBanner < this.banners.length - 1) this.activeBanner++;
  }

  prevBanner() {
    if (this.activeBanner > 0) this.activeBanner--;
  }

  goToBanner(index: number) {
    this.activeBanner = index;
  }

}