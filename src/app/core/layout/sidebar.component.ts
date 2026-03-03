import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  styles: [`
    .sidebar-container {
      background: #1C1917;
      border-right: 1px solid #292524;
    }

    .nav-item {
      position: relative;
      color: #A8A29E;
      transition: all 0.3s ease;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #14B8A6;
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .nav-item:hover {
      background: rgba(41, 37, 36, 0.5);
      color: #E7E5E4;
    }

    .nav-item-active {
      background: rgba(41, 37, 36, 0.3);
      color: #14B8A6;
    }

    .nav-item-active::before {
      transform: scaleY(1);
    }

    .nav-icon {
      transition: color 0.3s ease;
    }

    .nav-item:hover .nav-icon {
      color: #E7E5E4;
    }

    .nav-item-active .nav-icon {
      color: #14B8A6;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: #0F766E;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.125rem;
      color: white;
    }

    .user-avatar-collapsed {
      width: 32px;
      height: 32px;
      font-size: 0.875rem;
    }

    .separator {
      height: 1px;
      background: #292524;
    }

    .logout-btn {
      color: #A8A29E;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: #292524;
      color: #F87171;
    }

    .logout-icon {
      transition: color 0.3s ease;
    }

    .logout-btn:hover .logout-icon {
      color: #F87171;
    }

    .nav-tooltip {
      position: absolute;
      left: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%);
      background: #292524;
      color: #E7E5E4;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      border: 1px solid #44403C;
      z-index: 50;
    }

    .nav-item:hover .nav-tooltip,
    .logout-btn:hover .nav-tooltip {
      opacity: 1;
    }
  `],
  template: `
    <aside
      [class.w-64]="!collapsed()"
      [class.w-16]="collapsed()"
      class="sidebar-container transition-all duration-300 ease-in-out flex flex-col h-screen"
    >
      <!-- Logo Section -->
      <div class="p-4">
        <div class="flex items-center gap-3">
          @if (!collapsed()) {
            <div class="flex-1">
              <h1 class="text-2xl font-serif tracking-tight">
                <span class="text-teal-500">HY</span>
                <span class="text-stone-400 ml-1 font-light">Monitor</span>
              </h1>
            </div>
          } @else {
            <div class="flex items-center justify-center w-full">
              <span class="text-teal-500 text-2xl font-serif font-bold">HY</span>
            </div>
          }
        </div>
      </div>

      <div class="separator mx-4 mb-4"></div>

      <!-- Navigation Items -->
      <nav class="flex-1 px-3 overflow-y-auto">
        <ul class="space-y-1">
          @for (item of navItems; track item.path) {
            <li class="relative">
              <a
                [routerLink]="item.path"
                routerLinkActive="nav-item-active"
                [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
                class="nav-item flex items-center gap-3 px-3 py-3 rounded-lg"
              >
                <span class="nav-icon flex-shrink-0 transition-all duration-300" [innerHTML]="item.icon"></span>
                @if (!collapsed()) {
                  <span class="truncate font-medium">{{ item.label }}</span>
                } @else {
                  <span class="nav-tooltip">{{ item.label }}</span>
                }
              </a>
            </li>
          }
        </ul>
      </nav>

      <div class="separator mx-4 mt-4"></div>

      <!-- Toggle Button -->
      <div class="px-3 py-3">
        <button
          (click)="toggleCollapse()"
          class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg w-full"
        >
          <svg class="nav-icon w-5 h-5 flex-shrink-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            @if (collapsed()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            }
          </svg>
          @if (!collapsed()) {
            <span class="truncate font-medium">收起選單</span>
          } @else {
            <span class="nav-tooltip">展開選單</span>
          }
        </button>
      </div>

      <div class="separator mx-4"></div>

      <!-- User Section -->
      <div class="p-3">
        @if (currentUser()) {
          <div class="space-y-2">
            @if (!collapsed()) {
              <div class="flex items-center gap-3 px-3 py-2">
                <div [class]="userAvatarClass()">
                  {{ userInitial() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-stone-500 truncate">登入使用者</p>
                  <p class="font-semibold text-stone-200 truncate text-sm">{{ currentUser()!.displayName }}</p>
                </div>
              </div>
            } @else {
              <div class="flex items-center justify-center py-2">
                <div [class]="userAvatarClass()">
                  {{ userInitial() }}
                </div>
              </div>
            }
            <button
              (click)="handleLogout()"
              class="logout-btn relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 w-full"
            >
              <svg class="logout-icon w-5 h-5 flex-shrink-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              @if (!collapsed()) {
                <span class="truncate font-medium">登出</span>
              } @else {
                <span class="nav-tooltip">登出</span>
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
    return this.authService.getCurrentUser();
  });

  userInitial = computed(() => {
    const user = this.currentUser();
    if (!user?.displayName) return 'U';
    return user.displayName.charAt(0).toUpperCase();
  });

  userAvatarClass = computed(() => {
    return this.collapsed()
      ? 'user-avatar user-avatar-collapsed'
      : 'user-avatar';
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
