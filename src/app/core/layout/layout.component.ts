import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  styles: [`
    /* Main content area with subtle gradient */
    .main-content {
      background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
      position: relative;
      overflow: hidden;
    }

    /* Animated grid pattern overlay */
    .main-content::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        linear-gradient(rgba(6, 182, 212, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6, 182, 212, 0.02) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: grid-pulse 4s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes grid-pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    /* Content wrapper to ensure proper layering */
    .content-wrapper {
      position: relative;
      z-index: 1;
    }
  `],
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-sidebar (collapsedChange)="sidebarCollapsed.set($event)" />
      <main class="main-content flex-1 overflow-auto">
        <div class="content-wrapper p-6 md:p-8">
          <router-outlet />
        </div>
      </main>
    </div>
  `
})
export class LayoutComponent {
  sidebarCollapsed = signal(false);
}
