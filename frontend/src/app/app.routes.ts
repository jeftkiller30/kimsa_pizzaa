import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'categoria',
    loadComponent: () => import('./categoria/categoria.page').then(m => m.CategoriaPage)
  },
  {
    path: 'categoria/:nombre',
    loadComponent: () => import('./categoria/categoria.page').then(m => m.CategoriaPage)
  },
  {
    path: 'cuenta',
    loadComponent: () => import('./cuenta/cuenta.page').then(m => m.CuentaPage)
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./pedidos/pedidos.page').then(m => m.PedidosPage)
  },
  {
    path: 'email-auth',
    loadComponent: () => import('./email-auth/email-auth.page').then(m => m.EmailAuthPage)
  },
  {
    path: 'login-email',
    loadComponent: () => import('./pages/login-email/login-email.page').then(m => m.LoginEmailPage)
  },
  {
    path: 'register-email',
    loadComponent: () => import('./pages/register-email/register-email.page').then(m => m.RegisterEmailPage)
  },
  {
    path: 'nombre-usuario',
    loadComponent: () => import('./pages/nombre-usuario/nombre-usuario.page').then( m => m.NombreUsuarioPage)
  },
  {
    path: 'fecha-nacimiento',
    loadComponent: () => import('./pages/fecha-nacimiento/fecha-nacimiento.page').then( m => m.FechaNacimientoPage)
  },
  {
    path: 'mi-cuenta',
    loadComponent: () => import('./pages/mi-cuenta/mi-cuenta.page').then( m => m.MiCuentaPage)
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./pages/mi-perfil/mi-perfil.page').then( m => m.MiPerfilPage)
  },
  {
    path: 'editar-nombre',
    loadComponent: () => import('./pages/editar-nombre/editar-nombre.page').then( m => m.EditarNombrePage)
  },
  {
    path: 'editar-telefono',
    loadComponent: () => import('./pages/editar-telefono/editar-telefono.page').then( m => m.EditarTelefonoPage)
  },
  {
    path: 'editar-fecha',
    loadComponent: () => import('./pages/editar-fecha/editar-fecha.page').then( m => m.EditarFechaPage)
  },
  {
    path: 'seguridad',
    loadComponent: () => import('./pages/seguridad/seguridad.page').then( m => m.SeguridadPage)
  },
  {
    path: 'direcciones',
    loadComponent: () => import('./pages/direcciones/direcciones.page').then( m => m.DireccionesPage)
  },
];