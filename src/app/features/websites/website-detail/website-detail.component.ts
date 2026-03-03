import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WebsiteService } from '../../../core/services/website.service';
import { WebsiteResponse, CheckResult, HourlyStatsResponse } from '../../../core/models/website.model';

@Component({
  selector: 'app-website-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      @if (loading) {
        <div class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-teal-700 border-t-transparent"></div>
        </div>
      } @else if (website) {
        <!-- 返回連結 -->
        <a routerLink="/websites" class="text-stone-500 hover:text-teal-700 flex items-center gap-2 mb-6 transition-colors group">
          <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="font-medium">返回網站列表</span>
        </a>

        <!-- 網站資訊標題區 -->
        <div class="bg-white border border-stone-200 rounded-xl p-6 mb-6">
          <h1 class="font-serif text-3xl text-stone-800 mb-3">{{ website.alias }}</h1>
          <a
            [href]="website.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-teal-700 hover:text-teal-800 transition-all mb-4 inline-flex items-center gap-2 font-medium"
          >
            {{ website.url }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>

          <div class="flex items-center gap-4 flex-wrap mt-4">
            <!-- 狀態徽章 -->
            @if (website.status === 'UP') {
              <span class="inline-flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-teal-500"></span>
                <span class="text-sm font-medium text-teal-700">UP</span>
              </span>
            } @else if (website.status === 'DOWN') {
              <span class="inline-flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-red-500"></span>
                <span class="text-sm font-medium text-red-600">DOWN</span>
              </span>
            } @else if (website.status === 'SLOW') {
              <span class="inline-flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                <span class="text-sm font-medium text-amber-600">SLOW</span>
              </span>
            }

            <!-- 標籤 -->
            @for (tag of website.tags; track tag.id) {
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                [style.backgroundColor]="tag.color + '20'"
                [style.color]="tag.color"
              >
                {{ tag.name }}
              </span>
            }

            <!-- 最後檢查時間 -->
            @if (website.lastCheckedAt) {
              <span class="text-sm text-stone-400 ml-auto">
                最後檢查: {{ formatTime(website.lastCheckedAt) }}
              </span>
            }
          </div>
        </div>

        <!-- 統計數據卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- 目前回應時間 -->
          <div class="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <div class="text-stone-500 text-sm font-medium mb-3 uppercase tracking-wider">目前回應時間</div>
            <div class="font-serif text-4xl text-teal-700 mb-1">
              {{ website.responseMs ?? 0 }}
            </div>
            <div class="text-sm text-stone-400">milliseconds</div>
          </div>

          <!-- 平均回應時間 -->
          <div class="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <div class="text-stone-500 text-sm font-medium mb-3 uppercase tracking-wider">平均回應時間</div>
            <div class="font-serif text-4xl text-teal-700 mb-1">
              {{ avgResponseMs }}
            </div>
            <div class="text-sm text-stone-400">milliseconds</div>
          </div>

          <!-- 可用性百分比 -->
          <div class="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <div class="text-stone-500 text-sm font-medium mb-3 uppercase tracking-wider">可用性</div>
            <div class="font-serif text-4xl text-teal-700 mb-1">
              {{ uptimePercent }}
            </div>
            <div class="text-sm text-stone-400">percent</div>
          </div>
        </div>

        <!-- 回應時間圖表 -->
        @if (history.length > 0) {
          <div class="bg-white border border-stone-200 rounded-xl p-6 mb-6">
            <h2 class="font-semibold text-stone-800 text-lg mb-6">回應時間趨勢</h2>
            <svg class="w-full h-48" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#0F766E;stop-opacity:0.08" />
                  <stop offset="100%" style="stop-color:#0F766E;stop-opacity:0.02" />
                </linearGradient>
              </defs>

              <!-- Grid lines -->
              <line x1="20" y1="20" x2="20" y2="180" stroke="#E7E5E4" stroke-width="1"/>
              <line x1="20" y1="180" x2="780" y2="180" stroke="#E7E5E4" stroke-width="1"/>
              <line x1="20" y1="60" x2="780" y2="60" stroke="#E7E5E4" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="20" y1="100" x2="780" y2="100" stroke="#E7E5E4" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="20" y1="140" x2="780" y2="140" stroke="#E7E5E4" stroke-width="1" stroke-dasharray="4,4"/>

              <!-- Area fill -->
              @if (chartAreaPath) {
                <path [attr.d]="chartAreaPath" fill="url(#chartGradient)"/>
              }

              <!-- Line -->
              @if (chartPoints) {
                <polyline
                  [attr.points]="chartPoints"
                  fill="none"
                  stroke="#0F766E"
                  stroke-width="2"
                />
              }

              <!-- Data points -->
              @for (point of chartPointsArray; track $index) {
                <circle
                  [attr.cx]="point.x"
                  [attr.cy]="point.y"
                  r="3"
                  [attr.fill]="point.color"
                />
              }

              <!-- Y-axis labels -->
              <text x="5" y="25" class="text-xs" fill="#78716C">{{ maxResponseMs }}ms</text>
              <text x="5" y="185" class="text-xs" fill="#78716C">0ms</text>
            </svg>
          </div>
        }

        <!-- 檢查歷史記錄表格 -->
        <div class="bg-white border border-stone-200 rounded-xl p-6">
          <h2 class="font-semibold text-stone-800 text-lg mb-6">檢查歷史記錄</h2>

          @if (history.length === 0) {
            <div class="text-center py-8 text-stone-500">尚無檢查記錄</div>
          } @else {
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="bg-stone-50">
                    <th class="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">時間</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">狀態</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">HTTP 代碼</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">回應時間</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">錯誤訊息</th>
                  </tr>
                </thead>
                <tbody>
                  @for (result of displayedHistory; track result.id; let even = $even) {
                    <tr class="border-t border-stone-200" [class.bg-stone-50/50]="even">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-stone-800">
                        {{ formatTime(result.checkedAt) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        @if (result.status === 'UP') {
                          <span class="inline-flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-teal-500"></span>
                            <span class="text-sm font-medium text-teal-700">UP</span>
                          </span>
                        } @else if (result.status === 'DOWN') {
                          <span class="inline-flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-red-500"></span>
                            <span class="text-sm font-medium text-red-600">DOWN</span>
                          </span>
                        } @else if (result.status === 'SLOW') {
                          <span class="inline-flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span class="text-sm font-medium text-amber-600">SLOW</span>
                          </span>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-stone-800 font-mono">
                        {{ result.httpCode }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-teal-700 font-semibold">
                        {{ result.responseMs }} ms
                      </td>
                      <td class="px-6 py-4 text-sm text-red-600 font-mono">
                        {{ result.errorMsg || '-' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- 載入更多按鈕 -->
            @if (history.length > displayLimit) {
              <div class="mt-6 text-center">
                <button
                  (click)="loadMore()"
                  class="border border-teal-700 text-teal-700 hover:bg-teal-50 rounded-lg px-5 py-2 transition-colors font-medium"
                >
                  載入更多
                </button>
              </div>
            }
          }
        </div>
      } @else {
        <div class="text-center py-12 bg-white border border-stone-200 rounded-xl">
          <div class="text-stone-500 text-lg mb-4">找不到網站資訊</div>
          <a routerLink="/websites" class="text-teal-700 hover:text-teal-800 inline-flex items-center gap-2 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            返回網站列表
          </a>
        </div>
      }
    </div>
  `
})
export class WebsiteDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private websiteService = inject(WebsiteService);

  website: WebsiteResponse | null = null;
  history: CheckResult[] = [];
  hourlyStats: HourlyStatsResponse[] = [];
  loading = true;
  websiteId = '';
  displayLimit = 50;

  ngOnInit(): void {
    this.websiteId = this.route.snapshot.paramMap.get('id') || '';
    if (this.websiteId) {
      this.loadData();
    }
  }

  loadData(): void {
    this.loading = true;

    // 計算日期範圍 (過去7天)
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const fromISO = fromDate.toISOString();
    const toISO = toDate.toISOString();

    // 載入網站資料
    this.websiteService.getAll().subscribe({
      next: (websites) => {
        this.website = websites.find(w => w.id === this.websiteId) || null;
      },
      error: (err) => {
        console.error('Failed to load website:', err);
        this.loading = false;
      }
    });

    // 載入檢查歷史
    this.websiteService.getHistory(this.websiteId, 0, 100).subscribe({
      next: (history) => {
        this.history = history;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load history:', err);
        this.loading = false;
      }
    });

    // 載入小時統計數據
    this.websiteService.getStats(this.websiteId, fromISO, toISO).subscribe({
      next: (stats) => {
        this.hourlyStats = stats;
      },
      error: (err) => {
        console.error('Failed to load stats:', err);
      }
    });
  }

  get avgResponseMs(): number {
    // 優先使用 hourlyStats 計算平均回應時間
    if (this.hourlyStats.length > 0) {
      const validStats = this.hourlyStats.filter(s => s.avgResponseMs !== null && s.avgResponseMs > 0);
      if (validStats.length > 0) {
        const totalChecks = validStats.reduce((sum, s) => sum + s.checkCount, 0);
        const weightedSum = validStats.reduce((sum, s) => sum + (s.avgResponseMs! * s.checkCount), 0);
        return Math.round(weightedSum / totalChecks);
      }
    }

    // 回退到使用 history
    const valid = this.history.filter(h => h.responseMs > 0);
    if (valid.length === 0) return 0;
    return Math.round(valid.reduce((sum, h) => sum + h.responseMs, 0) / valid.length);
  }

  get uptimePercent(): number {
    // 優先使用 hourlyStats 計算可用性
    if (this.hourlyStats.length > 0) {
      const totalChecks = this.hourlyStats.reduce((sum, s) => sum + s.checkCount, 0);
      if (totalChecks > 0) {
        const upChecks = this.hourlyStats.reduce((sum, s) => sum + s.upCount + s.slowCount, 0);
        return Math.round((upChecks / totalChecks) * 1000) / 10;
      }
    }

    // 回退到使用 history
    if (this.history.length === 0) return 0;
    const upCount = this.history.filter(h => h.status === 'UP' || h.status === 'SLOW').length;
    return Math.round((upCount / this.history.length) * 1000) / 10;
  }

  get displayedHistory(): CheckResult[] {
    return this.history.slice(0, this.displayLimit);
  }

  get maxResponseMs(): number {
    const valid = this.history.filter(h => h.responseMs > 0);
    if (valid.length === 0) return 100;
    return Math.max(...valid.map(r => r.responseMs));
  }

  // 建立 SVG 圖表路徑
  get chartPoints(): string {
    if (this.history.length === 0) return '';

    const data = this.history.slice(0, 50).reverse(); // 取最近 50 筆，反轉為時間正序
    const maxMs = this.maxResponseMs;
    const width = 800;
    const height = 200;
    const padding = 20;

    const points = data.map((r, i) => {
      const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - ((r.responseMs || 0) / maxMs) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return points.join(' ');
  }

  get chartAreaPath(): string {
    if (this.history.length === 0) return '';

    const data = this.history.slice(0, 50).reverse();
    const maxMs = this.maxResponseMs;
    const width = 800;
    const height = 200;
    const padding = 20;

    const points = data.map((r, i) => {
      const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - ((r.responseMs || 0) / maxMs) * (height - 2 * padding);
      return [x, y];
    });

    if (points.length === 0) return '';

    // 建立封閉的區域路徑
    let path = `M ${points[0][0]},${height - padding}`; // 起始點在底部
    points.forEach(([x, y]) => {
      path += ` L ${x},${y}`;
    });
    path += ` L ${points[points.length - 1][0]},${height - padding}`; // 結束點在底部
    path += ' Z'; // 封閉路徑

    return path;
  }

  get chartPointsArray(): Array<{x: number, y: number, color: string}> {
    if (this.history.length === 0) return [];

    const data = this.history.slice(0, 50).reverse();
    const maxMs = this.maxResponseMs;
    const width = 800;
    const height = 200;
    const padding = 20;

    return data.map((r, i) => {
      const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - ((r.responseMs || 0) / maxMs) * (height - 2 * padding);

      let color = 'rgb(34, 197, 94)'; // green for UP
      if (r.status === 'DOWN') color = 'rgb(239, 68, 68)'; // red
      if (r.status === 'SLOW') color = 'rgb(234, 179, 8)'; // yellow

      return { x, y, color };
    });
  }

  loadMore(): void {
    this.displayLimit += 50;
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
