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
    <div class="min-h-screen bg-stone-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="font-serif text-3xl text-stone-800">
                Dashboard
              </h1>
              <p class="mt-1 text-sm text-stone-500">Real-time monitoring overview</p>
            </div>
            <button
              (click)="loadWebsites()"
              [disabled]="loading"
              class="inline-flex items-center px-4 py-2 border border-stone-300 hover:border-teal-600 text-stone-600 hover:text-teal-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              <svg class="mr-2 h-4 w-4" [class.animate-spin]="loading" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <!-- Total Card -->
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-3">
              <div class="status-indicator bg-stone-500"></div>
              <span class="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Sites</span>
            </div>
            <div class="font-serif text-4xl text-stone-800">{{ websites.length }}</div>
          </div>

          <!-- UP Card -->
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-3">
              <div class="status-indicator bg-teal-600"></div>
              <span class="text-xs font-medium text-stone-500 uppercase tracking-wider">Operational</span>
            </div>
            <div class="font-serif text-4xl text-teal-700">{{ upCount }}</div>
          </div>

          <!-- SLOW Card -->
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-3">
              <div class="status-indicator bg-amber-600"></div>
              <span class="text-xs font-medium text-stone-500 uppercase tracking-wider">Degraded</span>
            </div>
            <div class="font-serif text-4xl text-amber-600">{{ slowCount }}</div>
          </div>

          <!-- DOWN Card -->
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-3">
              <div class="status-indicator bg-red-600"></div>
              <span class="text-xs font-medium text-stone-500 uppercase tracking-wider">Critical</span>
            </div>
            <div class="font-serif text-4xl text-red-600">{{ downCount }}</div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white border border-stone-200 rounded-xl p-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Status Filter -->
            <div class="flex items-center gap-3">
              <span class="text-xs font-medium text-stone-500 uppercase tracking-wide">Status:</span>
              <div class="flex gap-2">
                @for (status of statusOptions; track status) {
                  <button
                    (click)="setStatusFilter(status)"
                    [class.filter-active]="statusFilter === status"
                    class="filter-pill"
                  >
                    {{ status }}
                  </button>
                }
              </div>
            </div>

            <!-- Search -->
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="applyFilters()"
                  placeholder="Search by alias or URL..."
                  class="search-input"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        @if (loading && websites.length === 0) {
          <div class="flex items-center justify-center py-16">
            <div class="text-center">
              <div class="relative w-16 h-16 mx-auto mb-6">
                <div class="absolute inset-0 rounded-full border-4 border-stone-200"></div>
                <div class="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin"></div>
              </div>
              <p class="text-sm text-stone-500">Loading monitoring data...</p>
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (!loading && websites.length === 0) {
          <div class="bg-white border border-stone-200 rounded-xl p-16 text-center">
            <div class="mx-auto w-20 h-20 mb-6">
              <svg class="w-full h-full text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-stone-800 mb-2">No Monitoring Targets</h3>
            <p class="text-sm text-stone-500 mb-8 max-w-md mx-auto">Begin monitoring your infrastructure by adding your first website endpoint.</p>
            <a
              routerLink="/websites"
              class="inline-flex items-center px-6 py-3 bg-teal-700 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Website
            </a>
          </div>
        }

        <!-- Website Cards Grid -->
        @if (!loading && filteredWebsites.length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (website of filteredWebsites; track website.id) {
              <div
                (click)="navigateToWebsite(website.id)"
                [class.website-card-flash]="website.id === lastUpdatedId"
                class="website-card group"
              >
                <div class="p-5">
                  <!-- Header -->
                  <div class="flex items-start gap-3 mb-4">
                    <div
                      [class.status-dot-up]="website.status === 'UP'"
                      [class.status-dot-slow]="website.status === 'SLOW'"
                      [class.status-dot-down]="website.status === 'DOWN'"
                      [class.status-dot-unknown]="!website.status"
                      class="status-dot"
                    ></div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-base font-semibold text-stone-800 truncate mb-1 group-hover:text-teal-700 transition-colors">
                        {{ website.alias || 'Unnamed' }}
                      </h3>
                      <p class="text-xs text-stone-500 truncate font-mono">{{ website.url }}</p>
                    </div>
                  </div>

                  <!-- Response Time -->
                  @if (website.responseMs !== null) {
                    <div class="mb-3">
                      <div class="text-xs text-stone-500 uppercase tracking-wider mb-1">Response Time</div>
                      <div
                        [class.text-teal-700]="website.status === 'UP'"
                        [class.text-amber-600]="website.status === 'SLOW'"
                        [class.text-red-600]="website.status === 'DOWN'"
                        class="text-lg font-semibold font-mono"
                      >
                        {{ website.responseMs }}<span class="text-sm ml-1 text-stone-500">ms</span>
                      </div>
                    </div>
                  }

                  <!-- HTTP Code -->
                  @if (website.httpCode !== null) {
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-xs text-stone-500 uppercase tracking-wider">HTTP Status</span>
                      <span class="text-xs font-mono font-semibold text-stone-700 bg-stone-100 px-2 py-1 rounded">{{ website.httpCode }}</span>
                    </div>
                  }

                  <!-- Tags -->
                  @if (website.tags && website.tags.length > 0) {
                    <div class="mb-3">
                      <div class="flex flex-wrap gap-1.5">
                        @for (tag of website.tags; track tag.id) {
                          <span
                            [style.background-color]="tag.color + '10'"
                            [style.color]="tag.color"
                            class="tag-chip"
                          >
                            {{ tag.name }}
                          </span>
                        }
                      </div>
                    </div>
                  }

                  <!-- Last Checked -->
                  <div class="flex items-center justify-between pt-3 border-t border-stone-200">
                    <span class="text-xs text-stone-400 uppercase tracking-wider">Last Check</span>
                    <span class="text-xs text-stone-600 font-medium font-mono">{{ getTimeAgo(website.lastCheckedAt) }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- No Results -->
        @if (!loading && websites.length > 0 && filteredWebsites.length === 0) {
          <div class="bg-white border border-stone-200 rounded-xl p-12 text-center">
            <svg class="mx-auto h-16 w-16 text-stone-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-stone-800 mb-2">No Matches Found</h3>
            <p class="text-sm text-stone-500 mb-6">Adjust your search criteria or filters to find monitoring targets.</p>
            <button
              (click)="clearFilters()"
              class="inline-flex items-center px-5 py-2.5 rounded-lg border border-stone-300 hover:border-teal-600 text-stone-600 hover:text-teal-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              Reset Filters
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* Stat Cards */
    .stat-card {
      position: relative;
      background: #ffffff;
      border: 1px solid #e7e5e4;
      border-radius: 0.75rem;
      padding: 1.25rem;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      border-color: #d6d3d1;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* Filter Pills */
    .filter-pill {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
      background: #f5f5f4;
      color: #57534e;
      border: 1px solid #e7e5e4;
      transition: all 0.2s ease;
    }

    .filter-pill:hover {
      border-color: #d6d3d1;
    }

    .filter-pill.filter-active {
      background: #0f766e;
      color: #ffffff;
      border-color: #0f766e;
    }

    /* Search Input */
    .search-input {
      display: block;
      width: 100%;
      padding: 0.625rem 0.75rem 0.625rem 2.5rem;
      background: #ffffff;
      border: 1px solid #d6d3d1;
      border-radius: 0.5rem;
      color: #1c1917;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .search-input::placeholder {
      color: #a8a29e;
    }

    .search-input:focus {
      outline: none;
      border-color: #0f766e;
      ring: 1px solid #0f766e;
    }

    /* Website Cards */
    .website-card {
      position: relative;
      background: #ffffff;
      border: 1px solid #e7e5e4;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .website-card:hover {
      border-color: #d6d3d1;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    /* Status Dot */
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .status-dot-up {
      background: #0d9488;
    }

    .status-dot-slow {
      background: #d97706;
    }

    .status-dot-down {
      background: #dc2626;
    }

    .status-dot-unknown {
      background: #78716c;
    }

    /* Tag Chips */
    .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.625rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* WebSocket Update Flash Animation */
    @keyframes flash-teal {
      0% {
        background: #ffffff;
      }
      50% {
        background: #f0fdfa;
      }
      100% {
        background: #ffffff;
      }
    }

    .website-card-flash {
      animation: flash-teal 0.6s ease-in-out;
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
