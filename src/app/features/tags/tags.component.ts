import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagService } from '../../core/services/tag.service';
import { TagResponse, TagRequest } from '../../core/models/tag.model';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @keyframes card-lift {
      from { transform: translateY(0); }
      to { transform: translateY(-4px); }
    }
    .tag-card:hover {
      animation: card-lift 0.2s ease-out forwards;
    }
  `],
  template: `
    <div class="min-h-screen py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-[var(--color-text-primary)]">Tag Management</h1>
            <div class="h-1 w-24 bg-gradient-to-r from-[var(--color-accent-cyan)] to-transparent rounded-full mt-2"></div>
          </div>
          <button
            type="button"
            (click)="openAddDialog()"
            class="px-6 py-3 bg-[var(--color-accent-cyan)] text-white rounded-lg hover:shadow-[var(--shadow-glow-cyan)] transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Tag
          </button>
        </div>

        <!-- Loading State -->
        @if (loading) {
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-2 border-[var(--color-accent-cyan)] border-t-transparent"></div>
          </div>
        }

        <!-- Empty State -->
        @if (!loading && tags.length === 0) {
          <div class="text-center py-12 glass-card rounded-xl">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] mb-4">
              <svg class="w-8 h-8 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-[var(--color-text-primary)] mb-2">No tags yet</h3>
            <p class="text-[var(--color-text-secondary)] mb-6">Create your first tag to organize your websites</p>
            <button
              type="button"
              (click)="openAddDialog()"
              class="px-6 py-3 bg-[var(--color-accent-cyan)] text-white rounded-lg hover:shadow-[var(--shadow-glow-cyan)] transition-all duration-300 font-semibold inline-flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Tag
            </button>
          </div>
        }

        <!-- Tag Grid -->
        @if (!loading && tags.length > 0) {
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            @for (tag of tags; track tag.id) {
              <div class="tag-card glass-card rounded-xl p-5 group hover:border-[var(--color-accent-cyan)] transition-all duration-300">
                <div class="flex items-center gap-3 mb-4">
                  <div
                    class="w-14 h-14 rounded-full shrink-0 flex items-center justify-center transition-all duration-300"
                    [style.background-color]="tag.color"
                    [style.box-shadow]="'0 0 20px ' + tag.color + '60'"
                  >
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-[var(--color-text-primary)] truncate text-lg">{{ tag.name }}</h3>
                    <p class="text-xs text-[var(--color-text-muted)]">{{ formatDate(tag.createdAt) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    (click)="openEditDialog(tag)"
                    class="flex-1 px-3 py-2 text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-accent-cyan)] hover:text-white rounded-lg transition-all font-medium"
                  >
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    type="button"
                    (click)="confirmDelete(tag)"
                    class="flex-1 px-3 py-2 text-sm text-[var(--color-accent-coral)] bg-[var(--color-accent-coral)]/10 hover:bg-[var(--color-accent-coral)] hover:text-white rounded-lg transition-all font-medium"
                  >
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            }
          </div>
        }

        <!-- Add/Edit Dialog -->
        @if (showDialog) {
          <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeDialog()">
            <div class="glass-card rounded-2xl shadow-[var(--shadow-glow-cyan)] w-full max-w-md" (click)="$event.stopPropagation()">
              <div class="p-6">
                <h2 class="text-xl font-bold text-[var(--color-text-primary)] mb-6">
                  {{ editingTag ? 'Edit Tag' : 'Add New Tag' }}
                </h2>

                <!-- Error Message -->
                @if (error) {
                  <div class="mb-4 p-3 bg-[var(--color-accent-coral)]/10 border border-[var(--color-accent-coral)]/30 rounded-lg">
                    <p class="text-sm text-[var(--color-accent-coral)]">{{ error }}</p>
                  </div>
                }

                <!-- Tag Name -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Tag Name <span class="text-[var(--color-accent-coral)]">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="tagName"
                    maxlength="50"
                    placeholder="e.g., Production, Development"
                    class="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent-cyan)] focus:border-[var(--color-accent-cyan)] focus:shadow-[var(--shadow-glow-cyan)] outline-none transition-all"
                  />
                  <p class="mt-1 text-xs text-[var(--color-text-muted)]">{{ tagName.length }}/50 characters</p>
                </div>

                <!-- Color Picker -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Tag Color <span class="text-[var(--color-accent-coral)]">*</span>
                  </label>

                  <!-- Preset Colors -->
                  <div class="grid grid-cols-5 gap-3 mb-3">
                    @for (color of presetColors; track color) {
                      <button
                        type="button"
                        (click)="tagColor = color"
                        class="w-full aspect-square rounded-full cursor-pointer ring-2 transition-all hover:scale-110"
                        [class.ring-offset-2]="tagColor === color"
                        [class.ring-offset-[var(--color-bg-card)]]="tagColor === color"
                        [class.ring-transparent]="tagColor !== color"
                        [style.background-color]="color"
                        [style.ring-color]="tagColor === color ? color : 'transparent'"
                        [style.box-shadow]="tagColor === color ? '0 0 20px ' + color + '80' : '0 0 10px ' + color + '40'"
                      ></button>
                    }
                  </div>

                  <!-- Custom Hex Input -->
                  <div>
                    <label class="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Custom Color (Hex)</label>
                    <input
                      type="text"
                      [(ngModel)]="tagColor"
                      placeholder="#3B82F6"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      class="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg font-mono text-sm focus:ring-2 focus:ring-[var(--color-accent-cyan)] focus:border-[var(--color-accent-cyan)] focus:shadow-[var(--shadow-glow-cyan)] outline-none transition-all"
                    />
                  </div>
                </div>

                <!-- Tag Preview -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Preview</label>
                  <div class="p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                    <span
                      class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white backdrop-blur-sm"
                      [style.background-color]="tagColor"
                      [style.box-shadow]="'0 0 15px ' + tagColor + '60'"
                    >
                      <span class="w-2 h-2 rounded-full bg-white/70"></span>
                      {{ tagName || 'Tag Name' }}
                    </span>
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
                    type="button"
                    (click)="save()"
                    [disabled]="!canSave() || saving"
                    class="px-6 py-2 bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-cyan-light)] text-white rounded-lg hover:shadow-[var(--shadow-glow-cyan-strong)] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    @if (saving) {
                      <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    }
                    {{ saving ? 'Saving...' : (editingTag ? 'Update' : 'Create') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Delete Confirmation Dialog -->
        @if (showDeleteDialog && deletingTag) {
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
                  Are you sure you want to delete <strong class="text-[var(--color-text-primary)]">{{ deletingTag.name }}</strong>?
                  It will be removed from all websites. This action cannot be undone.
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
                    (click)="deleteTag()"
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
    </div>
  `
})
export class TagsComponent implements OnInit {
  private tagService = inject(TagService);

  tags: TagResponse[] = [];
  loading = true;

  // Dialog state
  showDialog = false;
  editingTag: TagResponse | null = null;
  tagName = '';
  tagColor = '#3B82F6';
  saving = false;
  error = '';

  // Delete state
  showDeleteDialog = false;
  deletingTag: TagResponse | null = null;
  deleting = false;

  presetColors = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // green
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#6366F1', // indigo
    '#14B8A6', // teal
    '#F97316', // orange
    '#6B7280'  // gray
  ];

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.loading = true;
    this.tagService.getAll().subscribe({
      next: (tags) => {
        this.tags = tags;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load tags:', err);
        this.loading = false;
      }
    });
  }

  openAddDialog() {
    this.editingTag = null;
    this.tagName = '';
    this.tagColor = '#3B82F6';
    this.error = '';
    this.showDialog = true;
  }

  openEditDialog(tag: TagResponse) {
    this.editingTag = tag;
    this.tagName = tag.name;
    this.tagColor = tag.color;
    this.error = '';
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingTag = null;
    this.tagName = '';
    this.tagColor = '#3B82F6';
    this.error = '';
  }

  canSave(): boolean {
    const nameValid = this.tagName.trim().length > 0 && this.tagName.length <= 50;
    const colorValid = /^#[0-9A-Fa-f]{6}$/.test(this.tagColor);
    return nameValid && colorValid;
  }

  save() {
    if (!this.canSave()) return;

    this.saving = true;
    this.error = '';

    const request: TagRequest = {
      name: this.tagName.trim(),
      color: this.tagColor
    };

    const action = this.editingTag
      ? this.tagService.update(this.editingTag.id, request)
      : this.tagService.create(request);

    action.subscribe({
      next: () => {
        this.closeDialog();
        this.loadTags();
        this.saving = false;
      },
      error: (err) => {
        console.error('Failed to save tag:', err);
        this.error = err.status === 409
          ? 'Tag name already exists'
          : 'Failed to save tag. Please try again.';
        this.saving = false;
      }
    });
  }

  confirmDelete(tag: TagResponse) {
    this.deletingTag = tag;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.deletingTag = null;
    this.deleting = false;
  }

  deleteTag() {
    if (!this.deletingTag) return;

    this.deleting = true;
    this.tagService.delete(this.deletingTag.id).subscribe({
      next: () => {
        this.closeDeleteDialog();
        this.loadTags();
      },
      error: (err) => {
        console.error('Failed to delete tag:', err);
        this.deleting = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return date.toLocaleDateString();
  }
}
