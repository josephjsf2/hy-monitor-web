import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  styles: [`
    .main-content {
      background: #FAFAF9;
    }
  `],
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-sidebar (collapsedChange)="sidebarCollapsed.set($event)" />
      <main class="main-content flex-1 overflow-auto">
        <div class="p-6 md:p-8">
          <router-outlet />
        </div>
      </main>
    </div>
  `
})
export class LayoutComponent {
  sidebarCollapsed = signal(false);
}
