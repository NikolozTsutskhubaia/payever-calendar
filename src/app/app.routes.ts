import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/add-activity/add-activity.component').then(m => m.AddActivityComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
