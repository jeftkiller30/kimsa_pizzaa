import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
}

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class CategoriaPage implements OnInit {

  searchQuery: string = '';
  filteredProducts: any[] = []; // 🔥 usamos any para evitar errores
  allProducts: any[] = [];
  private activeSlug: string = 'promos';
  isLoading: boolean = true;

  categories = [
    { name: 'Promos',   slug: 'promos',   icon: 'assets/iconos/promos.png',   active: false },
    { name: 'Combos',   slug: 'combos',   icon: 'assets/iconos/combos.png',   active: false },
    { name: 'Pizzas',   slug: 'pizzas',   icon: 'assets/iconos/pizzas.png',   active: false },
    { name: 'Pastas',   slug: 'pastas',   icon: 'assets/iconos/pastas.png',   active: false },
    { name: 'Alitas',   slug: 'alitas',   icon: 'assets/iconos/alitas.png',   active: false },
    { name: 'Piqueos',  slug: 'piqueos',  icon: 'assets/iconos/piqueos.png',  active: false },
    { name: 'Bebidas',  slug: 'bebidas',  icon: 'assets/iconos/bebidas.png',  active: false },
    { name: 'Cervezas', slug: 'cervezas', icon: 'assets/iconos/cervezas.png', active: false },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  ngOnInit() {

    const productosRef = collection(this.firestore, 'productos');

    collectionData(productosRef, { idField: 'id' })
      .subscribe((data: any[]) => {

        // 🔥 normalizamos datos (evita errores)
        this.allProducts = data.map(p => ({
          id: p.id || '',
          nombre: p.nombre || '',
          descripcion: p.descripcion || '',
          precio: Number(p.precio) || 0,
          imagen: p.imagen || '',
          categoria: p.categoria || ''
        }));

        this.isLoading = false;
        this.applyFilters();
      });

    this.route.paramMap.subscribe(params => {
      const slug = params.get('nombre') || 'promos';
      this.setActiveCategory(slug.toLowerCase());
    });
  }

  setActiveCategory(slug: string) {
    this.categories.forEach(c => c.active = c.slug === slug);
    this.activeSlug = slug;
    this.applyFilters();
  }

  selectCategory(cat: any) {
    this.searchQuery = '';
    this.setActiveCategory(cat.slug);
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    let result = this.allProducts.filter(p => p.categoria === this.activeSlug);

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      );
    }

    this.filteredProducts = result;
  }

  openProductDetail(product: any) {
    this.router.navigate(['/producto', product.id]);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}