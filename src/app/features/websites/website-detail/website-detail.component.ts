import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WebsiteService } from '../../../core/services/website.service';
import { WebsiteResponse, CheckResult } from '../../../core/models/website.model';

@Component({
  selector: 'app-website-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      @if (loading) {
        <div class="flex items-center justify-center h-64">
          <div class="text-gray-500">載入中...</div>
        </div>
      } @else if (website) {
        <!-- 返回連結 -->
        <a routerLink="/websites" class="text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          返回網站列表
        </a>

        <!-- 網站資訊標題區 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ website.alias }}</h1>
          <a
            [href]="website.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-800 hover:underline mb-3 inline-block"
          >
            {{ website.url }}
            <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>

          <div class="flex items-center gap-4 flex-wrap">
            <!-- 狀態徽章 -->
            @if (website.status) {
              <span
                class="px-4 py-2 rounded-full text-sm font-semibold"
                [ngClass]="{
                  'bg-green-100 text-green-800': website.status === 'UP',
                  'bg-red-100 text-red-800': website.status === 'DOWN',
                  'bg-yellow-100 text-yellow-800': website.status === 'SLOW'
                }"
              >
                {{ website.status }}
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
              <span class="text-sm text-gray-500 ml-auto">
                最後檢查: {{ formatTime(website.lastCheckedAt) }}
              </span>
            }
          </div>
        </div>

        <!-- 統計數據卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- 目前回應時間 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div class="text-gray-500 text-sm font-medium mb-2">目前回應時間</div>
            <div class="text-4xl font-bold text-gray-900">
              {{ website.responseMs ?? 0 }}
              <span class="text-lg text-gray-500">ms</span>
            </div>
          </div>

          <!-- 平均回應時間 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div class="text-gray-500 text-sm font-medium mb-2">平均回應時間</div>
            <div class="text-4xl font-bold text-gray-900">
              {{ avgResponseMs }}
              <span class="text-lg text-gray-500">ms</span>
            </div>
          </div>

          <!-- 可用性百分比 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div class="text-gray-500 text-sm font-medium mb-2">可用性</div>
            <div class="text-4xl font-bold text-gray-900">
              {{ uptimePercent }}
              <span class="text-lg text-gray-500">%</span>
            </div>
          </div>
        </div>

        <!-- 回應時間圖表 -->
        @if (history.length > 0) {
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">回應時間趨勢</h2>
            <svg class="w-full h-48" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
              <!-- 背景網格線 -->
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:rgb(34, 197, 94);stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:rgb(34, 197, 94);stop-opacity:0.05" />
                </linearGradient>
              </defs>

              <!-- Y軸參考線 -->
              <line x1="20" y1="20" x2="20" y2="180" stroke="#e5e7eb" stroke-width="1"/>
              <line x1="20" y1="180" x2="780" y2="180" stroke="#e5e7eb" stroke-width="1"/>

              <!-- 圖表區域填充 -->
              @if (chartAreaPath) {
                <path [attr.d]="chartAreaPath" fill="url(#chartGradient)" opacity="0.6"/>
              }

              <!-- 圖表線條 -->
              @if (chartPoints) {
                <polyline
                  [attr.points]="chartPoints"
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  stroke-width="2"
                />
              }

              <!-- 數據點 -->
              @for (point of chartPointsArray; track $index) {
                <circle
                  [attr.cx]="point.x"
                  [attr.cy]="point.y"
                  r="3"
                  [attr.fill]="point.color"
                />
              }

              <!-- Y軸標籤 -->
              <text x="5" y="25" class="text-xs fill-gray-500">{{ maxResponseMs }}ms</text>
              <text x="5" y="185" class="text-xs fill-gray-500">0ms</text>
            </svg>
          </div>
        }

        <!-- 檢查歷史記錄表格 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">檢查歷史記錄</h2>

          @if (history.length === 0) {
            <div class="text-center py-8 text-gray-500">尚無檢查記錄</div>
          } @else {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HTTP 代碼</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">回應時間</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">錯誤訊息</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (result of displayedHistory; track result.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatTime(result.checkedAt) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="px-2 py-1 rounded-full text-xs font-semibold"
                          [ngClass]="{
                            'bg-green-100 text-green-800': result.status === 'UP',
                            'bg-red-100 text-red-800': result.status === 'DOWN',
                            'bg-yellow-100 text-yellow-800': result.status === 'SLOW'
                          }"
                        >
                          {{ result.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ result.httpCode }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ result.responseMs }} ms
                      </td>
                      <td class="px-6 py-4 text-sm text-red-600">
                        {{ result.errorMsg || '-' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- 載入更多按鈕 -->
            @if (history.length > displayLimit) {
              <div class="mt-4 text-center">
                <button
                  (click)="loadMore()"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  載入更多
                </button>
              </div>
            }
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <div class="text-gray-500 text-lg">找不到網站資訊</div>
          <a routerLink="/websites" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
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
  }

  get avgResponseMs(): number {
    const valid = this.history.filter(h => h.responseMs > 0);
    if (valid.length === 0) return 0;
    return Math.round(valid.reduce((sum, h) => sum + h.responseMs, 0) / valid.length);
  }

  get uptimePercent(): number {
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
