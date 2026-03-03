import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, switchMap } from 'rxjs';
import { WebsiteService } from '../../core/services/website.service';
import { TagService } from '../../core/services/tag.service';
import { WebsiteResponse } from '../../core/models/website.model';
import { TagResponse } from '../../core/models/tag.model';

@Component({
  selector: 'app-websites',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 10px currentColor; }
      50% { box-shadow: 0 0 20px currentColor; }
    }
    .status-badge-up {
      animation: pulse-glow 2s ease-in-out infinite;
      color: var(--color-accent-cyan);
    }
    .status-badge-down {
      animation: pulse-glow 2s ease-in-out infinite;
      color: var(--color-accent-coral);
    }
    .status-badge-slow {
      animation: pulse-glow 2s ease-in-out infinite;
      color: var(--color-accent-amber);
    }
  `],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Website Management
          </h1>
          <div class="h-1 w-24 bg-gradient-to-r from-[var(--color-accent-cyan)] to-transparent rounded-full"></div>
        </div>
        <button
          (click)="openAddDialog()"
          class="px-6 py-3 bg-[var(--color-accent-cyan)] text-white rounded-lg hover:shadow-[var(--shadow-glow-cyan)] transition-all duration-300 font-semibold"
        >
          + Add Website
        </button>
      </div>

      <!-- Loading State -->
      @if (loading) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-[var(--color-accent-cyan)] border-t-transparent"></div>
        </div>
      }

      <!-- Desktop Table View -->
      @if (!loading) {
        <div class="hidden md:block glass-card rounded-xl overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-[var(--color-bg-secondary)]/60">
                <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Alias
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  URL
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Tags
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Enabled
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              @for (website of websites; track website.id) {
                <tr class="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-card-hover)] transition-all duration-200 group relative">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-semibold text-[var(--color-text-primary)]">{{ website.alias }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-[var(--color-text-secondary)] max-w-md truncate">{{ website.url }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @if (website.status === 'UP') {
                      <span class="status-badge-up inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-accent-cyan)]/20 text-[var(--color-accent-cyan)]">
                        UP
                      </span>
                    } @else if (website.status === 'DOWN') {
                      <span class="status-badge-down inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-accent-coral)]/20 text-[var(--color-accent-coral)]">
                        DOWN
                      </span>
                    } @else if (website.status === 'SLOW') {
                      <span class="status-badge-slow inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]">
                        SLOW
                      </span>
                    } @else {
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-text-muted)]/20 text-[var(--color-text-muted)]">
                        N/A
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1.5">
                      @for (tag of website.tags; track tag.id) {
                        <span
                          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                          [style.background-color]="tag.color + '30'"
                          [style.color]="tag.color"
                        >
                          {{ tag.name }}
                        </span>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @if (website.enabled) {
                      <div class="w-2 h-2 rounded-full bg-[var(--color-accent-cyan)] shadow-[0_0_10px_var(--color-accent-cyan)]"></div>
                    } @else {
                      <div class="w-2 h-2 rounded-full bg-[var(--color-text-muted)]"></div>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <button
                        (click)="openEditDialog(website)"
                        class="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan)]/10 rounded-lg transition-all duration-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        title="Edit"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        (click)="confirmDelete(website)"
                        class="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-coral)] hover:bg-[var(--color-accent-coral)]/10 rounded-lg transition-all duration-200 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                        title="Delete"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent-cyan)] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center text-[var(--color-text-muted)]">
                    No websites found. Click "Add Website" to create one.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden space-y-4">
          @for (website of websites; track website.id) {
            <div class="glass-card glass-card-hover rounded-xl p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-[var(--color-text-primary)] mb-1">{{ website.alias }}</h3>
                  <p class="text-sm text-[var(--color-text-secondary)] break-all">{{ website.url }}</p>
                </div>
                <div class="flex items-center gap-2 ml-3">
                  <button
                    (click)="openEditDialog(website)"
                    class="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan)]/10 rounded-lg transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    (click)="confirmDelete(website)"
                    class="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-coral)] hover:bg-[var(--color-accent-coral)]/10 rounded-lg transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                @if (website.status === 'UP') {
                  <span class="status-badge-up inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-accent-cyan)]/20 text-[var(--color-accent-cyan)]">
                    UP
                  </span>
                } @else if (website.status === 'DOWN') {
                  <span class="status-badge-down inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-accent-coral)]/20 text-[var(--color-accent-coral)]">
                    DOWN
                  </span>
                } @else if (website.status === 'SLOW') {
                  <span class="status-badge-slow inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]">
                    SLOW
                  </span>
                } @else {
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-text-muted)]/20 text-[var(--color-text-muted)]">
                    N/A
                  </span>
                }
                <span class="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                  @if (website.enabled) {
                    <div class="w-2 h-2 rounded-full bg-[var(--color-accent-cyan)] shadow-[0_0_10px_var(--color-accent-cyan)]"></div>
                    Enabled
                  } @else {
                    <div class="w-2 h-2 rounded-full bg-[var(--color-text-muted)]"></div>
                    Disabled
                  }
                </span>
              </div>
              @if (website.tags.length > 0) {
                <div class="flex flex-wrap gap-1.5 mt-3">
                  @for (tag of website.tags; track tag.id) {
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                      [style.background-color]="tag.color + '30'"
                      [style.color]="tag.color"
                    >
                      {{ tag.name }}
                    </span>
                  }
                </div>
              }
            </div>
          } @empty {
            <div class="glass-card rounded-xl p-12 text-center text-[var(--color-text-muted)]">
              No websites found. Click "Add Website" to create one.
            </div>
          }
        </div>
      }

      <!-- Add/Edit Dialog -->
      @if (showDialog) {
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeDialog()">
          <div class="glass-card rounded-2xl shadow-[var(--shadow-glow-cyan)] w-full max-w-lg" (click)="$event.stopPropagation()">
            <div class="p-6">
              <h2 class="text-xl font-bold text-[var(--color-text-primary)] mb-6">
                {{ editingWebsite ? 'Edit Website' : 'Add Website' }}
              </h2>

              <form [formGroup]="dialogForm" (ngSubmit)="save()">
                <!-- URL -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    URL <span class="text-[var(--color-accent-coral)]">*</span>
                  </label>
                  <input
                    type="url"
                    formControlName="url"
                    placeholder="https://example.com"
                    class="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent-cyan)] focus:border-[var(--color-accent-cyan)] focus:shadow-[var(--shadow-glow-cyan)] outline-none transition-all"
                    [class.border-red-500]="dialogForm.get('url')?.invalid && dialogForm.get('url')?.touched"
                  />
                  @if (dialogForm.get('url')?.invalid && dialogForm.get('url')?.touched) {
                    <p class="mt-1 text-sm text-[var(--color-accent-coral)]">Please enter a valid URL</p>
                  }
                </div>

                <!-- Alias -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Alias
                  </label>
                  <input
                    type="text"
                    formControlName="alias"
                    placeholder="My Website"
                    class="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent-cyan)] focus:border-[var(--color-accent-cyan)] focus:shadow-[var(--shadow-glow-cyan)] outline-none transition-all"
                  />
                </div>

                <!-- Enabled Toggle -->
                <div class="mb-4">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <div class="relative">
                      <input
                        type="checkbox"
                        formControlName="enabled"
                        class="sr-only peer"
                      />
                      <div class="w-11 h-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-accent-cyan)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--color-text-muted)] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent-cyan)] peer-checked:after:bg-white peer-checked:shadow-[var(--shadow-glow-cyan)]"></div>
                    </div>
                    <span class="text-sm font-medium text-[var(--color-text-secondary)]">Enabled</span>
                  </label>
                </div>

                <!-- Tags -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Tags
                  </label>
                  <div class="flex flex-wrap gap-2">
                    @for (tag of tags; track tag.id) {
                      <button
                        type="button"
                        (click)="toggleTag(tag.id)"
                        [class]="selectedTagIds.has(tag.id) ? 'ring-2 shadow-[0_0_15px] opacity-100' : 'opacity-60'"
                        [style.background-color]="tag.color + '30'"
                        [style.color]="tag.color"
                        [style.ring-color]="tag.color"
                        [style.box-shadow]="selectedTagIds.has(tag.id) ? '0 0 15px ' + tag.color + '80' : ''"
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-100 backdrop-blur-sm"
                      >
                        @if (selectedTagIds.has(tag.id)) {
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        }
                        {{ tag.name }}
                      </button>
                    }
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    (click)="closeDialog()"
                    [disabled]="saving"
                    class="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    [disabled]="dialogForm.invalid || saving"
                    class="px-6 py-2 bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-cyan-light)] text-white rounded-lg hover:shadow-[var(--shadow-glow-cyan-strong)] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    @if (saving) {
                      <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    }
                    {{ saving ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirmation Dialog -->
      @if (showDeleteDialog && deletingWebsite) {
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeDeleteDialog()">
          <div class="glass-card rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.5)] w-full max-w-md" (click)="$event.stopPropagation()">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-accent-coral)]/20 flex items-center justify-center border border-[var(--color-accent-coral)]/50">
                  <svg class="w-6 h-6 text-[var(--color-accent-coral)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-[var(--color-text-primary)]">Confirm Delete</h2>
              </div>

              <p class="text-[var(--color-text-secondary)] mb-6">
                Are you sure you want to delete <strong class="text-[var(--color-text-primary)]">{{ deletingWebsite.alias }}</strong>?
                This action cannot be undone.
              </p>

              <div class="flex items-center justify-end gap-3">
                <button
                  type="button"
                  (click)="closeDeleteDialog()"
                  [disabled]="deleting"
                  class="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  (click)="deleteWebsite()"
                  [disabled]="deleting"
                  class="px-6 py-2 bg-[var(--color-accent-coral)] text-white rounded-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 animate-pulse"
                >
                  @if (deleting) {
                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  }
                  {{ deleting ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class WebsitesComponent implements OnInit {
  private websiteService = inject(WebsiteService);
  private tagService = inject(TagService);
  private fb = inject(FormBuilder);

  websites: WebsiteResponse[] = [];
  tags: TagResponse[] = [];
  loading = true;

  // Dialog state
  showDialog = false;
  editingWebsite: WebsiteResponse | null = null;
  dialogForm!: FormGroup;
  selectedTagIds: Set<string> = new Set();
  saving = false;

  // Delete state
  showDeleteDialog = false;
  deletingWebsite: WebsiteResponse | null = null;
  deleting = false;

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  private initForm() {
    this.dialogForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      alias: [''],
      enabled: [true]
    });
  }

  loadData() {
    this.loading = true;
    forkJoin({
      websites: this.websiteService.getAll(),
      tags: this.tagService.getAll()
    }).subscribe({
      next: ({ websites, tags }) => {
        this.websites = websites;
        this.tags = tags;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load data:', error);
        this.loading = false;
      }
    });
  }

  openAddDialog() {
    this.editingWebsite = null;
    this.selectedTagIds = new Set();
    this.dialogForm.reset({
      url: '',
      alias: '',
      enabled: true
    });
    this.showDialog = true;
  }

  openEditDialog(website: WebsiteResponse) {
    this.editingWebsite = website;
    this.selectedTagIds = new Set(website.tags.map(t => t.id));
    this.dialogForm.patchValue({
      url: website.url,
      alias: website.alias,
      enabled: website.enabled
    });
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingWebsite = null;
    this.selectedTagIds.clear();
    this.dialogForm.reset();
  }

  toggleTag(tagId: string) {
    if (this.selectedTagIds.has(tagId)) {
      this.selectedTagIds.delete(tagId);
    } else {
      this.selectedTagIds.add(tagId);
    }
  }

  save() {
    if (this.dialogForm.invalid || this.saving) {
      return;
    }

    this.saving = true;
    const formValue = this.dialogForm.value;
    const request = {
      url: formValue.url,
      alias: formValue.alias || undefined,
      enabled: formValue.enabled
    };

    const saveOperation = this.editingWebsite
      ? this.websiteService.update(this.editingWebsite.id, request)
      : this.websiteService.create(request);

    saveOperation.pipe(
      switchMap(website => {
        // Set tags after creating/updating the website
        const tagIds = Array.from(this.selectedTagIds);
        return this.websiteService.setTags(website.id, { tagIds });
      })
    ).subscribe({
      next: () => {
        this.saving = false;
        this.closeDialog();
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to save website:', error);
        this.saving = false;
        // TODO: Show error toast
      }
    });
  }

  confirmDelete(website: WebsiteResponse) {
    this.deletingWebsite = website;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.deletingWebsite = null;
  }

  deleteWebsite() {
    if (!this.deletingWebsite || this.deleting) {
      return;
    }

    this.deleting = true;
    this.websiteService.delete(this.deletingWebsite.id).subscribe({
      next: () => {
        this.deleting = false;
        this.closeDeleteDialog();
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to delete website:', error);
        this.deleting = false;
        // TODO: Show error toast
      }
    });
  }
}
