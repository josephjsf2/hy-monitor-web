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
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-serif text-3xl text-stone-800">
            Website Management
          </h1>
          <p class="text-sm text-stone-500 mt-1">網站管理</p>
        </div>
        <button
          (click)="openAddDialog()"
          class="bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-5 py-2.5 font-semibold transition-colors"
        >
          + Add Website
        </button>
      </div>

      <!-- Loading State -->
      @if (loading) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-teal-700 border-t-transparent"></div>
        </div>
      }

      <!-- Desktop Table View -->
      @if (!loading) {
        <div class="hidden md:block bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-stone-50">
                <th class="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Alias
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  URL
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Tags
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Enabled
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              @for (website of websites; track website.id; let odd = $odd) {
                <tr class="border-t border-stone-100 hover:bg-stone-50 transition-colors" [class.bg-stone-50/50]="odd">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-semibold text-stone-800">{{ website.alias }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-stone-600 max-w-md truncate">{{ website.url }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @if (website.status === 'UP') {
                      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700">
                        <span class="w-2 h-2 rounded-full bg-teal-500"></span>
                        UP
                      </span>
                    } @else if (website.status === 'DOWN') {
                      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
                        <span class="w-2 h-2 rounded-full bg-red-500"></span>
                        DOWN
                      </span>
                    } @else if (website.status === 'SLOW') {
                      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                        SLOW
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                        <span class="w-2 h-2 rounded-full bg-stone-400"></span>
                        N/A
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1.5">
                      @for (tag of website.tags; track tag.id) {
                        <span
                          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                          [style.background-color]="tag.color + '26'"
                          [style.color]="tag.color"
                        >
                          {{ tag.name }}
                        </span>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @if (website.enabled) {
                      <div class="w-2 h-2 rounded-full bg-teal-600"></div>
                    } @else {
                      <div class="w-2 h-2 rounded-full bg-stone-400"></div>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <button
                        (click)="openEditDialog(website)"
                        class="p-2 text-stone-400 hover:text-teal-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        (click)="confirmDelete(website)"
                        class="p-2 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center text-stone-500">
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
            <div class="bg-white border border-stone-200 rounded-xl p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-stone-800 mb-1">{{ website.alias }}</h3>
                  <p class="text-sm text-stone-600 break-all">{{ website.url }}</p>
                </div>
                <div class="flex items-center gap-2 ml-3">
                  <button
                    (click)="openEditDialog(website)"
                    class="p-2 text-stone-400 hover:text-teal-700 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    (click)="confirmDelete(website)"
                    class="p-2 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                @if (website.status === 'UP') {
                  <span class="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700">
                    <span class="w-2 h-2 rounded-full bg-teal-500"></span>
                    UP
                  </span>
                } @else if (website.status === 'DOWN') {
                  <span class="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <span class="w-2 h-2 rounded-full bg-red-500"></span>
                    DOWN
                  </span>
                } @else if (website.status === 'SLOW') {
                  <span class="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    SLOW
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                    <span class="w-2 h-2 rounded-full bg-stone-400"></span>
                    N/A
                  </span>
                }
                <span class="text-xs text-stone-500 flex items-center gap-1">
                  @if (website.enabled) {
                    <div class="w-2 h-2 rounded-full bg-teal-600"></div>
                    Enabled
                  } @else {
                    <div class="w-2 h-2 rounded-full bg-stone-400"></div>
                    Disabled
                  }
                </span>
              </div>
              @if (website.tags.length > 0) {
                <div class="flex flex-wrap gap-1.5 mt-3">
                  @for (tag of website.tags; track tag.id) {
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      [style.background-color]="tag.color + '26'"
                      [style.color]="tag.color"
                    >
                      {{ tag.name }}
                    </span>
                  }
                </div>
              }
            </div>
          } @empty {
            <div class="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-500">
              No websites found. Click "Add Website" to create one.
            </div>
          }
        </div>
      }

      <!-- Add/Edit Dialog -->
      @if (showDialog) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="closeDialog()">
          <div class="bg-white rounded-xl shadow-lg border border-stone-200 w-full max-w-lg" (click)="$event.stopPropagation()">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-stone-800 mb-6">
                {{ editingWebsite ? 'Edit Website' : 'Add Website' }}
              </h2>

              <form [formGroup]="dialogForm" (ngSubmit)="save()">
                <!-- URL -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-stone-700 mb-2">
                    URL <span class="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    formControlName="url"
                    placeholder="https://example.com"
                    class="w-full px-4 py-2.5 bg-white border border-stone-300 text-stone-900 rounded-lg focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
                    [class.border-red-500]="dialogForm.get('url')?.invalid && dialogForm.get('url')?.touched"
                  />
                  @if (dialogForm.get('url')?.invalid && dialogForm.get('url')?.touched) {
                    <p class="mt-1 text-sm text-red-600">Please enter a valid URL</p>
                  }
                </div>

                <!-- Alias -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-stone-700 mb-2">
                    Alias
                  </label>
                  <input
                    type="text"
                    formControlName="alias"
                    placeholder="My Website"
                    class="w-full px-4 py-2.5 bg-white border border-stone-300 text-stone-900 rounded-lg focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
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
                      <div class="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </div>
                    <span class="text-sm font-medium text-stone-700">Enabled</span>
                  </label>
                </div>

                <!-- Tags -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-stone-700 mb-2">
                    Tags
                  </label>
                  <div class="flex flex-wrap gap-2">
                    @for (tag of tags; track tag.id) {
                      <button
                        type="button"
                        (click)="toggleTag(tag.id)"
                        [class.ring-2]="selectedTagIds.has(tag.id)"
                        [class.opacity-60]="!selectedTagIds.has(tag.id)"
                        [style.background-color]="tag.color + '26'"
                        [style.color]="tag.color"
                        [style.ring-color]="tag.color"
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-100"
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
                    class="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    [disabled]="dialogForm.invalid || saving"
                    class="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="closeDeleteDialog()">
          <div class="bg-white rounded-xl shadow-lg border border-stone-200 w-full max-w-md" (click)="$event.stopPropagation()">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 class="text-xl font-semibold text-stone-800">Confirm Delete</h2>
              </div>

              <p class="text-stone-600 mb-6">
                Are you sure you want to delete <strong class="text-stone-900">{{ deletingWebsite.alias }}</strong>?
                This action cannot be undone.
              </p>

              <div class="flex items-center justify-end gap-3">
                <button
                  type="button"
                  (click)="closeDeleteDialog()"
                  [disabled]="deleting"
                  class="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  (click)="deleteWebsite()"
                  [disabled]="deleting"
                  class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
