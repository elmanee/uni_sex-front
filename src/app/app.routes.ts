import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'estudiantes',
        pathMatch: 'full'
      },
      {
        path: 'estudiantes',
        loadComponent: () => import('./pages/estudiantes/lista/lista.component').then(m => m.ListaComponent)
      },
      {
        path: 'catalogos',
        loadComponent: () => import('./pages/catalogos/catalogos/catalogos.component').then(m => m.CatalogosComponent)
      },

    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
