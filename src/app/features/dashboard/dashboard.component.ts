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
    <div class="min-h-screen bg-grid-pattern py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-[var(--color-accent-cyan-light)] to-[var(--color-accent-cyan)] bg-clip-text text-transparent">
                Mission Control
              </h1>
              <p class="mt-2 text-sm text-[var(--color-text-secondary)] font-light tracking-wide">Real-time infrastructure monitoring</p>
            </div>
            <button
              (click)="loadWebsites()"
              [disabled]="loading"
              class="group relative inline-flex items-center px-5 py-2.5 overflow-hidden rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent-cyan)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-cyan)]/0 via-[var(--color-accent-cyan)]/10 to-[var(--color-accent-cyan)]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <svg class="relative mr-2 h-4 w-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-cyan)] transition-colors" [class.animate-spin]="loading" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="relative text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-cyan)] transition-colors">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <!-- Total Card -->
          <div class="stat-card stat-card-neutral group">
            <div class="stat-accent stat-accent-neutral"></div>
            <div class="flex items-center justify-between mb-3">
              <svg class="h-5 w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="text-4xl font-bold text-[var(--color-text-primary)] mb-1">{{ websites.length }}</div>
            <div class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Total Sites</div>
          </div>

          <!-- UP Card -->
          <div class="stat-card stat-card-up group">
            <div class="stat-accent stat-accent-up"></div>
            <div class="flex items-center justify-between mb-3">
              <svg class="h-5 w-5 text-[var(--color-accent-cyan)] opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-4xl font-bold text-[var(--color-accent-cyan-light)] mb-1">{{ upCount }}</div>
            <div class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Operational</div>
          </div>

          <!-- SLOW Card -->
          <div class="stat-card stat-card-slow group">
            <div class="stat-accent stat-accent-slow"></div>
            <div class="flex items-center justify-between mb-3">
              <svg class="h-5 w-5 text-[var(--color-accent-amber)] opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-4xl font-bold text-[var(--color-accent-amber)] mb-1">{{ slowCount }}</div>
            <div class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Degraded</div>
          </div>

          <!-- DOWN Card -->
          <div class="stat-card stat-card-down group">
            <div class="stat-accent stat-accent-down"></div>
            <div class="flex items-center justify-between mb-3">
              <svg class="h-5 w-5 text-[var(--color-accent-coral)] opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="text-4xl font-bold text-[var(--color-accent-coral)] mb-1 animate-pulse">{{ downCount }}</div>
            <div class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Critical</div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="glass-card rounded-xl p-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Status Filter -->
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide text-xs">Status:</span>
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
                  <svg class="h-5 w-5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div class="absolute inset-0 rounded-full border-4 border-[var(--color-bg-secondary)]"></div>
                <div class="absolute inset-0 rounded-full border-4 border-[var(--color-accent-cyan)] border-t-transparent animate-spin"></div>
                <div class="absolute inset-2 rounded-full bg-[var(--color-accent-cyan)] opacity-20 animate-pulse"></div>
              </div>
              <p class="text-sm text-[var(--color-text-secondary)] font-light">Initializing monitoring systems...</p>
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (!loading && websites.length === 0) {
          <div class="glass-card rounded-xl p-16 text-center">
            <div class="relative mx-auto w-20 h-20 mb-6">
              <svg class="w-full h-full text-[var(--color-text-muted)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div class="absolute inset-0 bg-[var(--color-accent-cyan)] opacity-5 rounded-full animate-ping"></div>
            </div>
            <h3 class="text-xl font-semibold text-[var(--color-text-primary)] mb-2">No Monitoring Targets</h3>
            <p class="text-sm text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">Begin monitoring your infrastructure by adding your first website endpoint.</p>
            <a
              routerLink="/websites"
              class="cta-button"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Deploy First Monitor
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
                <!-- Status Indicator Strip -->
                <div
                  [class.status-strip-up]="website.status === 'UP'"
                  [class.status-strip-slow]="website.status === 'SLOW'"
                  [class.status-strip-down]="website.status === 'DOWN'"
                  [class.status-strip-unknown]="!website.status"
                  class="status-strip"
                ></div>

                <div class="p-5">
                  <!-- Header -->
                  <div class="flex items-start gap-3 mb-4">
                    <div
                      [class.status-dot-up]="website.status === 'UP'"
                      [class.status-dot-slow]="website.status === 'SLOW'"
                      [class.status-dot-down]="website.status === 'DOWN'"
                      [class.status-dot-unknown]="!website.status"
                      class="status-dot"
                    >
                      <div class="status-dot-inner"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-base font-semibold text-[var(--color-text-primary)] truncate mb-1 group-hover:text-[var(--color-accent-cyan-light)] transition-colors">
                        {{ website.alias || 'Unnamed' }}
                      </h3>
                      <p class="text-xs text-[var(--color-text-muted)] truncate font-mono">{{ website.url }}</p>
                    </div>
                  </div>

                  <!-- Response Time - Featured -->
                  @if (website.responseMs !== null) {
                    <div class="mb-4 p-3 rounded-lg bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
                      <div class="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Response Time</div>
                      <div
                        [class.text-[var(--color-accent-cyan-light)]]="website.status === 'UP'"
                        [class.text-[var(--color-accent-amber)]]="website.status === 'SLOW'"
                        [class.text-[var(--color-accent-coral)]]="website.status === 'DOWN'"
                        class="text-2xl font-bold font-mono"
                      >
                        {{ website.responseMs }}<span class="text-sm ml-1 text-[var(--color-text-muted)]">ms</span>
                      </div>
                    </div>
                  }

                  <!-- HTTP Code -->
                  @if (website.httpCode !== null) {
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">HTTP Status</span>
                      <span class="text-xs font-mono font-semibold text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)]/50 px-2 py-1 rounded">{{ website.httpCode }}</span>
                    </div>
                  }

                  <!-- Tags -->
                  @if (website.tags && website.tags.length > 0) {
                    <div class="mb-3">
                      <div class="flex flex-wrap gap-1.5">
                        @for (tag of website.tags; track tag.id) {
                          <span
                            [style.background-color]="tag.color + '15'"
                            [style.color]="tag.color"
                            [style.border-color]="tag.color + '30'"
                            class="tag-chip"
                          >
                            {{ tag.name }}
                          </span>
                        }
                      </div>
                    </div>
                  }

                  <!-- Last Checked -->
                  <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                    <span class="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Last Check</span>
                    <span class="text-xs text-[var(--color-text-secondary)] font-medium font-mono">{{ getTimeAgo(website.lastCheckedAt) }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- No Results -->
        @if (!loading && websites.length > 0 && filteredWebsites.length === 0) {
          <div class="glass-card rounded-xl p-12 text-center">
            <svg class="mx-auto h-16 w-16 text-[var(--color-text-muted)] opacity-40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-[var(--color-text-primary)] mb-2">No Matches Found</h3>
            <p class="text-sm text-[var(--color-text-secondary)] mb-6">Adjust your search criteria or filters to find monitoring targets.</p>
            <button
              (click)="clearFilters()"
              class="inline-flex items-center px-5 py-2.5 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-accent-cyan)] hover:text-[var(--color-accent-cyan)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]"
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
      background: var(--color-bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1.5rem;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: var(--color-bg-card-hover);
      border-color: var(--color-accent-cyan);
      box-shadow: var(--shadow-glow-cyan);
      transform: translateY(-2px);
    }

    .stat-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
      opacity: 0.7;
    }

    .stat-accent-neutral { --accent-color: var(--color-text-muted); }
    .stat-accent-up { --accent-color: var(--color-accent-cyan); }
    .stat-accent-slow { --accent-color: var(--color-accent-amber); }
    .stat-accent-down {
      --accent-color: var(--color-accent-coral);
      animation: pulse-glow 2s ease-in-out infinite;
    }

    @keyframes pulse-glow {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; box-shadow: 0 0 20px var(--accent-color); }
    }

    /* Filter Pills */
    .filter-pill {
      position: relative;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
      background: var(--color-bg-secondary);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .filter-pill::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--color-accent-cyan);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .filter-pill:hover {
      border-color: var(--color-accent-cyan);
      color: var(--color-accent-cyan-light);
    }

    .filter-pill.filter-active {
      background: var(--color-accent-cyan);
      color: var(--color-bg-primary);
      border-color: var(--color-accent-cyan);
      box-shadow: var(--shadow-glow-cyan);
    }

    .filter-pill.filter-active::before {
      opacity: 0.2;
    }

    /* Search Input */
    .search-input {
      display: block;
      width: 100%;
      padding: 0.625rem 0.75rem 0.625rem 2.5rem;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .search-input::placeholder {
      color: var(--color-text-muted);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-accent-cyan);
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
    }

    /* Website Cards */
    .website-card {
      position: relative;
      background: var(--color-bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .website-card:hover {
      background: var(--color-bg-card-hover);
      border-color: var(--color-accent-cyan);
      box-shadow: var(--shadow-glow-cyan);
      transform: translateY(-4px);
    }

    /* Status Strip */
    .status-strip {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 4px;
      transition: all 0.3s ease;
    }

    .status-strip-up {
      background: linear-gradient(180deg, var(--color-accent-cyan-light), var(--color-accent-cyan));
      box-shadow: 0 0 10px var(--color-accent-cyan);
    }

    .status-strip-slow {
      background: linear-gradient(180deg, #fbbf24, var(--color-accent-amber));
      box-shadow: 0 0 10px var(--color-accent-amber);
    }

    .status-strip-down {
      background: linear-gradient(180deg, #f87171, var(--color-accent-coral));
      box-shadow: 0 0 10px var(--color-accent-coral);
      animation: pulse-strip 2s ease-in-out infinite;
    }

    .status-strip-unknown {
      background: linear-gradient(180deg, #64748b, #475569);
    }

    @keyframes pulse-strip {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; box-shadow: 0 0 20px var(--color-accent-coral); }
    }

    /* Status Dot */
    .status-dot {
      position: relative;
      width: 0.875rem;
      height: 0.875rem;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .status-dot-inner {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: currentColor;
    }

    .status-dot-up {
      color: var(--color-accent-cyan);
      box-shadow: 0 0 8px var(--color-accent-cyan);
    }

    .status-dot-slow {
      color: var(--color-accent-amber);
      box-shadow: 0 0 8px var(--color-accent-amber);
    }

    .status-dot-down {
      color: var(--color-accent-coral);
      box-shadow: 0 0 8px var(--color-accent-coral);
      animation: pulse-dot 2s ease-in-out infinite;
    }

    .status-dot-unknown {
      color: #64748b;
    }

    @keyframes pulse-dot {
      0%, 100% {
        opacity: 0.8;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
        box-shadow: 0 0 16px var(--color-accent-coral);
      }
    }

    /* Tag Chips */
    .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.625rem;
      border-radius: 0.375rem;
      font-size: 0.625rem;
      font-weight: 600;
      border: 1px solid;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* CTA Button */
    .cta-button {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, var(--color-accent-cyan-dark), var(--color-accent-cyan));
      color: var(--color-bg-primary);
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 0.5rem;
      border: none;
      box-shadow: var(--shadow-glow-cyan);
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .cta-button:hover {
      background: linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-cyan-light));
      box-shadow: var(--shadow-glow-cyan-strong);
      transform: translateY(-2px);
    }

    /* WebSocket Update Flash Animation */
    @keyframes flash-cyan {
      0% {
        box-shadow: 0 0 0 0 rgba(6, 182, 212, 0);
        border-color: var(--color-border);
      }
      50% {
        box-shadow: 0 0 30px 10px rgba(6, 182, 212, 0.4);
        border-color: var(--color-accent-cyan-light);
        transform: scale(1.02);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(6, 182, 212, 0);
        border-color: var(--color-border);
      }
    }

    .website-card-flash {
      animation: flash-cyan 0.8s ease-in-out;
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
