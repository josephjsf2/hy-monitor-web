import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebsiteService } from '../../core/services/website.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { WebsiteResponse } from '../../core/models/website.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p class="mt-1 text-sm text-gray-500">Real-time website monitoring</p>
            </div>
            <button
              (click)="loadWebsites()"
              [disabled]="loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="mr-2 h-4 w-4" [class.animate-spin]="loading" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-xl shadow-sm p-6 border-t-4 border-gray-500">
            <div class="text-3xl font-bold text-gray-900">{{ websites.length }}</div>
            <div class="text-sm text-gray-500 mt-1">Total Websites</div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6 border-t-4 border-green-500">
            <div class="text-3xl font-bold text-green-600">{{ upCount }}</div>
            <div class="text-sm text-gray-500 mt-1">UP</div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6 border-t-4 border-yellow-500">
            <div class="text-3xl font-bold text-yellow-600">{{ slowCount }}</div>
            <div class="text-sm text-gray-500 mt-1">SLOW</div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6 border-t-4 border-red-500">
            <div class="text-3xl font-bold text-red-600">{{ downCount }}</div>
            <div class="text-sm text-gray-500 mt-1">DOWN</div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Status Filter -->
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-700">Status:</span>
              <div class="flex gap-2">
                <button
                  *ngFor="let status of statusOptions"
                  (click)="setStatusFilter(status)"
                  [class.bg-indigo-600]="statusFilter === status"
                  [class.text-white]="statusFilter === status"
                  [class.bg-white]="statusFilter !== status"
                  [class.text-gray-700]="statusFilter !== status"
                  [class.border-gray-300]="statusFilter !== status"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {{ status }}
                </button>
              </div>
            </div>

            <!-- Search -->
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="applyFilters()"
                  placeholder="Search by alias or URL..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        @if (loading && websites.length === 0) {
          <div class="flex items-center justify-center py-12">
            <div class="text-center">
              <svg class="animate-spin h-12 w-12 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-4 text-sm text-gray-500">Loading websites...</p>
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (!loading && websites.length === 0) {
          <div class="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No websites yet</h3>
            <p class="mt-2 text-sm text-gray-500">Get started by adding your first website to monitor.</p>
            <div class="mt-6">
              <a
                routerLink="/websites"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add your first website
              </a>
            </div>
          </div>
        }

        <!-- Website Cards Grid -->
        @if (!loading && filteredWebsites.length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (website of filteredWebsites; track website.id) {
              <div
                (click)="navigateToWebsite(website.id)"
                [class.animate-pulse-once]="website.id === lastUpdatedId"
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div
                      [class.bg-green-500]="website.status === 'UP'"
                      [class.bg-yellow-500]="website.status === 'SLOW'"
                      [class.bg-red-500]="website.status === 'DOWN'"
                      [class.animate-pulse]="website.status === 'DOWN'"
                      [class.bg-gray-300]="!website.status"
                      class="w-3 h-3 rounded-full"
                    ></div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-lg font-semibold text-gray-900 truncate">
                        {{ website.alias || 'Unnamed' }}
                      </h3>
                      <p class="text-sm text-gray-500 truncate">{{ website.url }}</p>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <!-- Response Time -->
                  @if (website.responseMs !== null) {
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Response Time</span>
                      <span
                        [class.text-green-600]="website.status === 'UP'"
                        [class.text-yellow-600]="website.status === 'SLOW'"
                        [class.text-red-600]="website.status === 'DOWN'"
                        class="text-sm font-medium"
                      >
                        {{ website.responseMs }}ms
                      </span>
                    </div>
                  }

                  <!-- HTTP Code -->
                  @if (website.httpCode !== null) {
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">HTTP Code</span>
                      <span class="text-sm font-medium text-gray-900">{{ website.httpCode }}</span>
                    </div>
                  }

                  <!-- Tags -->
                  @if (website.tags && website.tags.length > 0) {
                    <div>
                      <div class="flex flex-wrap gap-1.5 mt-2">
                        @for (tag of website.tags; track tag.id) {
                          <span
                            [style.background-color]="tag.color + '20'"
                            [style.color]="tag.color"
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          >
                            {{ tag.name }}
                          </span>
                        }
                      </div>
                    </div>
                  }

                  <!-- Last Checked -->
                  <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span class="text-xs text-gray-500">Last checked</span>
                    <span class="text-xs text-gray-700 font-medium">{{ getTimeAgo(website.lastCheckedAt) }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- No Results -->
        @if (!loading && websites.length > 0 && filteredWebsites.length === 0) {
          <div class="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No websites found</h3>
            <p class="mt-2 text-sm text-gray-500">Try adjusting your filters or search query.</p>
            <div class="mt-6">
              <button
                (click)="clearFilters()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Clear filters
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse-once {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      50% {
        transform: scale(1.02);
        box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.2), 0 4px 6px -2px rgba(99, 102, 241, 0.1);
      }
    }

    .animate-pulse-once {
      animation: pulse-once 0.6s ease-in-out;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private websiteService = inject(WebsiteService);
  private wsService = inject(WebSocketService);
  private router = inject(Router);

  websites: WebsiteResponse[] = [];
  filteredWebsites: WebsiteResponse[] = [];
  loading = true;

  statusFilter: string = 'ALL';
  statusOptions = ['ALL', 'UP', 'SLOW', 'DOWN'];
  searchQuery = '';

  lastUpdatedId: string | null = null;

  private wsSub?: Subscription;

  ngOnInit() {
    this.loadWebsites();
    this.wsService.connect();
    this.wsSub = this.wsService.getStatusUpdates().subscribe(update => {
      const idx = this.websites.findIndex(w => w.id === update.websiteId);
      if (idx !== -1) {
        this.websites[idx] = {
          ...this.websites[idx],
          status: update.status,
          httpCode: update.httpCode,
          responseMs: update.responseMs,
          lastCheckedAt: update.checkedAt
        };

        // Trigger pulse animation
        this.lastUpdatedId = update.websiteId;
        setTimeout(() => {
          this.lastUpdatedId = null;
        }, 600);

        this.applyFilters();
      }
    });
  }

  ngOnDestroy() {
    this.wsSub?.unsubscribe();
    this.wsService.disconnect();
  }

  loadWebsites() {
    this.loading = true;
    this.websiteService.getAll().subscribe({
      next: (data) => {
        this.websites = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredWebsites = this.websites.filter(w => {
      const matchesStatus = this.statusFilter === 'ALL' || w.status === this.statusFilter;
      const matchesSearch = !this.searchQuery ||
        (w.alias?.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        w.url.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.applyFilters();
  }

  clearFilters() {
    this.statusFilter = 'ALL';
    this.searchQuery = '';
    this.applyFilters();
  }

  navigateToWebsite(id: string) {
    this.router.navigate(['/websites', id]);
  }

  // Helper methods
  get upCount() {
    return this.websites.filter(w => w.status === 'UP').length;
  }

  get downCount() {
    return this.websites.filter(w => w.status === 'DOWN').length;
  }

  get slowCount() {
    return this.websites.filter(w => w.status === 'SLOW').length;
  }

  getTimeAgo(dateStr: string | null): string {
    if (!dateStr) return 'Never';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
}
