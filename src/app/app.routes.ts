import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'websites',
    loadComponent: () => import('./features/websites/websites.component').then(m => m.WebsitesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'websites/:id',
    loadComponent: () => import('./features/websites/website-detail/website-detail.component').then(m => m.WebsiteDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tags',
    loadComponent: () => import('./features/tags/tags.component').then(m => m.TagsComponent),
    canActivate: [authGuard]
  }
];
