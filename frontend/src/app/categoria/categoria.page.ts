import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  CommonModule,
  Location
} from '@angular/common';

import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import {
  Firestore,
  collection,
  collectionData
} from '@angular/fire/firestore';

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

  @ViewChild('tabsWrapper')
  tabsWrapper!: ElementRef;

  searchQuery = '';

  filteredProducts: any[] = [];

  allProducts: any[] = [];

  private activeSlug = 'promos';

  isLoading = true;

  categories = [
    {
      name: 'Promos',
      slug: 'promos',
      icon: 'assets/iconos/promos.png',
      active: false
    },
    {
      name: 'Combos',
      slug: 'combos',
      icon: 'assets/iconos/combos.png',
      active: false
    },
    {
      name: 'Pizzas',
      slug: 'pizzas',
      icon: 'assets/iconos/pizzas.png',
      active: false
    },
    {
      name: 'Pastas',
      slug: 'pastas',
      icon: 'assets/iconos/pastas.png',
      active: false
    },
    {
      name: 'Alitas',
      slug: 'alitas',
      icon: 'assets/iconos/alitas.png',
      active: false
    },
    {
      name: 'Piqueos',
      slug: 'piqueos',
      icon: 'assets/iconos/piqueos.png',
      active: false
    },
    {
      name: 'Bebidas',
      slug: 'bebidas',
      icon: 'assets/iconos/bebidas.png',
      active: false
    },
    {
      name: 'Cervezas',
      slug: 'cervezas',
      icon: 'assets/iconos/cervezas.png',
      active: false
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private location: Location
  ) {}

  ngOnInit() {

    const productosRef =
      collection(this.firestore, 'productos');

    collectionData(
      productosRef,
      { idField: 'id' }
    )
    .subscribe((data: any[]) => {

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

      const categoriaGuardada =
        localStorage.getItem(
          'categoriaActiva'
        );

      const slug =
        categoriaGuardada ||
        params.get('nombre') ||
        'promos';

      this.setActiveCategory(
        slug.toLowerCase()
      );

    });

  }

  ionViewWillEnter() {

    this.restaurarScrollTabs();

  }

  setActiveCategory(slug: string) {

    this.categories.forEach(c =>
      c.active = c.slug === slug
    );

    this.activeSlug = slug;

    this.applyFilters();

  }

  selectCategory(cat: any) {

    this.searchQuery = '';

    this.setActiveCategory(cat.slug);

    localStorage.setItem(
      'categoriaActiva',
      cat.slug
    );

    this.location.replaceState(
      `/categoria/${cat.slug}`
    );

    setTimeout(() => {

      this.guardarScrollTabs();

    }, 0);

  }

  guardarScrollTabs() {

    if (this.tabsWrapper?.nativeElement) {

      localStorage.setItem(
        'tabsScrollLeft',
        this.tabsWrapper
          .nativeElement
          .scrollLeft
          .toString()
      );

    }

  }

  restaurarScrollTabs() {

    const scrollGuardado =
      localStorage.getItem(
        'tabsScrollLeft'
      );

    if (
      scrollGuardado &&
      this.tabsWrapper?.nativeElement
    ) {

      this.tabsWrapper.nativeElement.scrollLeft =
        Number(scrollGuardado);

    }

  }

  onSearch() {

    this.applyFilters();

  }

  applyFilters() {

    let result =
      this.allProducts.filter(
        p => p.categoria === this.activeSlug
      );

    if (this.searchQuery.trim()) {

      const q =
        this.searchQuery
          .toLowerCase()
          .trim();

      result = result.filter(p =>
        p.nombre
          .toLowerCase()
          .includes(q) ||

        p.descripcion
          .toLowerCase()
          .includes(q)
      );

    }

    this.filteredProducts = result;

  }

  openProductDetail(p: any) {

    localStorage.setItem(
      'categoriaActiva',
      this.activeSlug
    );

    this.guardarScrollTabs();

    this.router.navigate(
      ['/producto-detalle'],
      {
        state: {
          producto: p
        }
      }
    );

  }

  goBack() {

    localStorage.removeItem(
      'categoriaActiva'
    );

    localStorage.removeItem(
      'tabsScrollLeft'
    );

    this.router.navigate(['/home']);

  }

}