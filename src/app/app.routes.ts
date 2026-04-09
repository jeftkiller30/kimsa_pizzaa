import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'categoria',
    loadComponent: () => import('./categoria/categoria.page').then( m => m.CategoriaPage)
  },

  {
  path: 'categoria/:nombre',
  loadComponent: () =>
    import('./categoria/categoria.page').then(m => m.CategoriaPage)
}
];


