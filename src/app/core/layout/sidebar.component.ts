import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside
      [class]="sidebarClasses()"
      class="bg-gray-900 text-gray-300 transition-all duration-300 ease-in-out flex flex-col h-screen"
    >
      <!-- Branding Section -->
      <div class="p-4 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <!-- Monitor Icon -->
          <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          @if (!collapsed()) {
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-white truncate">HY Monitor</h1>
            </div>
          }
          <!-- Toggle Button -->
          <button
            (click)="toggleCollapse()"
            class="p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
            [title]="collapsed() ? '展開側邊欄' : '收起側邊欄'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              @if (collapsed()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              }
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 p-4 overflow-y-auto">
        <ul class="space-y-2">
          @for (item of navItems; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-indigo-600 text-white"
                [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                [title]="collapsed() ? item.label : ''"
              >
                <span class="flex-shrink-0" [innerHTML]="item.icon"></span>
                @if (!collapsed()) {
                  <span class="truncate">{{ item.label }}</span>
                }
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- User Section -->
      <div class="border-t border-gray-700 p-4">
        @if (currentUser()) {
          <div class="space-y-3">
            @if (!collapsed()) {
              <div class="px-3 py-2">
                <p class="text-sm text-gray-400 truncate">登入使用者</p>
                <p class="font-medium text-white truncate">{{ currentUser()!.displayName }}</p>
              </div>
            }
            <button
              (click)="handleLogout()"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors w-full text-left group"
              [title]="collapsed() ? '登出' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              @if (!collapsed()) {
                <span class="group-hover:text-red-400 transition-colors truncate">登出</span>
              }
            </button>
          </div>
        }
      </div>
    </aside>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  collapsed = signal(false);
  collapsedChange = output<boolean>();

  currentUser = computed(() => {
    // Subscribe to currentUser$ observable
    let user = this.authService.getCurrentUser();
    return user;
  });

  sidebarClasses = computed(() => {
    return this.collapsed() ? 'w-16' : 'w-64';
  });

  navItems = [
    {
      path: '/dashboard',
      label: '儀表板',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>`
    },
    {
      path: '/websites',
      label: '網站管理',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>`
    },
    {
      path: '/tags',
      label: '標籤管理',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>`
    }
  ];

  toggleCollapse(): void {
    this.collapsed.update(value => !value);
    this.collapsedChange.emit(this.collapsed());
  }

  handleLogout(): void {
    if (confirm('確定要登出嗎？')) {
      this.authService.logout();
    }
  }
}
