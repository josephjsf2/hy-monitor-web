import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .animate-fade-in {
      animation: fade-in 0.4s ease-out;
    }
  `],
  template: `
    <div class="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4">
      <!-- Login Card -->
      <div class="w-full max-w-md animate-fade-in">
        <div class="bg-white border border-stone-200 shadow-sm rounded-xl p-8">

          <!-- Heading -->
          <div class="text-center mb-8">
            <h1 class="font-serif text-3xl text-stone-800 mb-2">HY Monitor</h1>
            <p class="text-stone-500 text-sm">Sign in to your account</p>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">

            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-stone-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="w-full px-4 py-3 bg-white border rounded-lg outline-none transition-all duration-200 text-stone-800 placeholder-stone-400"
                [class.border-stone-300]="!loginForm.get('username')?.invalid || !loginForm.get('username')?.touched"
                [class.border-red-400]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                [class.focus:border-teal-600]="!loginForm.get('username')?.invalid"
                [class.focus:ring-1]="!loginForm.get('username')?.invalid"
                [class.focus:ring-teal-600]="!loginForm.get('username')?.invalid"
                placeholder="Enter username"
              />
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <p class="text-red-500 text-xs mt-1.5 flex items-center">
                  <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Username is required
                </p>
              }
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 bg-white border rounded-lg outline-none transition-all duration-200 text-stone-800 placeholder-stone-400"
                [class.border-stone-300]="!loginForm.get('password')?.invalid || !loginForm.get('password')?.touched"
                [class.border-red-400]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                [class.focus:border-teal-600]="!loginForm.get('password')?.invalid"
                [class.focus:ring-1]="!loginForm.get('password')?.invalid"
                [class.focus:ring-teal-600]="!loginForm.get('password')?.invalid"
                placeholder="Enter password"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="text-red-500 text-xs mt-1.5 flex items-center">
                  <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Password is required
                </p>
              }
            </div>

            <!-- Error Message -->
            @if (error) {
              <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-500 text-xs flex items-start">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  {{ error }}
                </p>
              </div>
            }

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || loading"
              class="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              @if (loading) {
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                <span>Sign In</span>
              }
            </button>
          </form>

          <!-- Register Link -->
          <div class="mt-6 pt-6 border-t border-stone-200 text-center">
            <p class="text-stone-600 text-sm">
              Don't have an account?
              <a routerLink="/register" class="text-teal-700 hover:text-teal-800 font-medium ml-1 transition-colors">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;
  error = '';

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const loginRequest: LoginRequest = {
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!
    };

    this.authService.login(loginRequest).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.status === 401
          ? 'Invalid username or password'
          : 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
