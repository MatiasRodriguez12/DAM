import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'listado-dispositivos',
    loadComponent: () => import('./listado-dispositivos/listado-dispositivos.page').then( m => m.ListadoDispositivosPage)
  },
  {
    path: 'informacion-dispositivo',
    loadComponent: () => import('./informacion-dispositivo/informacion-dispositivo.page').then( m => m.InformacionDispositivoPage)
  },
  {
    path: 'informacion-dispositivo/:id/:nombre',
    loadComponent: () => import('./informacion-dispositivo/informacion-dispositivo.page').then( m => m.InformacionDispositivoPage)
  },
  {
    path: 'historial-dispositivo',
    loadComponent: () => import('./historial-dispositivo/historial-dispositivo.page').then( m => m.HistorialDispositivoPage)
  },
  {
    path: 'historial-dispositivo/:id',
    loadComponent: () => import('./historial-dispositivo/historial-dispositivo.page').then( m => m.HistorialDispositivoPage)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
