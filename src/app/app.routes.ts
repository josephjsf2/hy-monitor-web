import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'websites',
        loadComponent: () => import('./features/websites/websites.component').then(m => m.WebsitesComponent)
      },
      {
        path: 'websites/:id',
        loadComponent: () => import('./features/websites/website-detail/website-detail.component').then(m => m.WebsiteDetailComponent)
      },
      {
        path: 'tags',
        loadComponent: () => import('./features/tags/tags.component').then(m => m.TagsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
