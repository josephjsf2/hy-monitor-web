import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles: [`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(0.95);
        opacity: 0.8;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(0.95);
        opacity: 0.8;
      }
    }

    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .animate-fade-in-up {
      animation: fade-in-up 0.6s ease-out;
    }

    .animate-fade-in {
      animation: fade-in 0.8s ease-out;
    }

    .animate-pulse-ring {
      animation: pulse-ring 2s ease-in-out infinite;
    }

    .gradient-text {
      background: linear-gradient(135deg, #06b6d4, #22d3ee);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .input-glow:focus {
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1), 0 0 20px rgba(6, 182, 212, 0.2);
    }

    .btn-glow {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      background-size: 200% 200%;
      animation: gradient-shift 3s ease infinite;
      box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
    }

    .btn-glow:hover {
      box-shadow: 0 6px 30px rgba(6, 182, 212, 0.5);
      transform: translateY(-2px);
    }

    .btn-glow:active {
      transform: translateY(0);
    }

    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
    .stagger-5 { animation-delay: 0.5s; }
    .stagger-6 { animation-delay: 0.6s; }
    .stagger-7 { animation-delay: 0.7s; }
  `],
  template: `
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a0e1a] via-[#121827] to-[#0a0e1a]">
      <!-- Animated background grid -->
      <div class="absolute inset-0 bg-grid-pattern"></div>

      <!-- Decorative gradient orbs -->
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-ring"></div>
      <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse-ring" style="animation-delay: 1s;"></div>

      <!-- Content Container -->
      <div class="relative z-10 min-h-screen flex items-center justify-end px-4 sm:px-8 lg:px-16">
        <div class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <!-- Left side: Registration Form -->
          <div class="w-full max-w-md mx-auto lg:mx-0 lg:order-2 animate-fade-in-up">
            <!-- Mobile branding -->
            <div class="lg:hidden mb-8 text-center">
              <h1 class="text-4xl font-bold mb-2">
                <span class="gradient-text">HY Monitor</span>
              </h1>
              <p class="text-slate-400">Website Monitoring Command Center</p>
            </div>

            <!-- Glass card -->
            <div class="glass-card rounded-2xl p-8 shadow-2xl border border-slate-700/50">
              <div class="mb-8">
                <h2 class="text-2xl font-semibold text-slate-100 mb-2">Create Account</h2>
                <p class="text-slate-400 text-sm">Request access to the monitoring system</p>
              </div>

              <!-- Register Form -->
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
                <!-- Username Field -->
                <div class="stagger-1 animate-fade-in-up">
                  <label for="username" class="block text-sm font-medium text-slate-300 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    formControlName="username"
                    class="w-full px-4 py-3 bg-slate-900/50 border rounded-lg outline-none transition-all duration-200 text-slate-100 placeholder-slate-500 input-glow"
                    [class.border-slate-700]="!registerForm.get('username')?.invalid || !registerForm.get('username')?.touched"
                    [class.border-red-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                    placeholder="Choose username"
                  />
                  @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
                    <p class="text-red-400 text-xs mt-1.5 flex items-center">
                      <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      @if (registerForm.get('username')?.errors?.['required']) {
                        Username is required
                      }
                      @if (registerForm.get('username')?.errors?.['minlength']) {
                        Minimum 3 characters required
                      }
                    </p>
                  }
                </div>

                <!-- Display Name Field -->
                <div class="stagger-2 animate-fade-in-up">
                  <label for="displayName" class="block text-sm font-medium text-slate-300 mb-2">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    formControlName="displayName"
                    class="w-full px-4 py-3 bg-slate-900/50 border rounded-lg outline-none transition-all duration-200 text-slate-100 placeholder-slate-500 input-glow"
                    [class.border-slate-700]="!registerForm.get('displayName')?.invalid || !registerForm.get('displayName')?.touched"
                    [class.border-red-500]="registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched"
                    placeholder="Your display name"
                  />
                  @if (registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched) {
                    <p class="text-red-400 text-xs mt-1.5 flex items-center">
                      <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      Display name is required
                    </p>
                  }
                </div>

                <!-- Password Field -->
                <div class="stagger-3 animate-fade-in-up">
                  <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    formControlName="password"
                    class="w-full px-4 py-3 bg-slate-900/50 border rounded-lg outline-none transition-all duration-200 text-slate-100 placeholder-slate-500 input-glow"
                    [class.border-slate-700]="!registerForm.get('password')?.invalid || !registerForm.get('password')?.touched"
                    [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                    placeholder="Choose password"
                  />
                  @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                    <p class="text-red-400 text-xs mt-1.5 flex items-center">
                      <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      @if (registerForm.get('password')?.errors?.['required']) {
                        Password is required
                      }
                      @if (registerForm.get('password')?.errors?.['minlength']) {
                        Minimum 6 characters required
                      }
                    </p>
                  }
                </div>

                <!-- Confirm Password Field -->
                <div class="stagger-4 animate-fade-in-up">
                  <label for="confirmPassword" class="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    formControlName="confirmPassword"
                    class="w-full px-4 py-3 bg-slate-900/50 border rounded-lg outline-none transition-all duration-200 text-slate-100 placeholder-slate-500 input-glow"
                    [class.border-slate-700]="!registerForm.get('confirmPassword')?.invalid || !registerForm.get('confirmPassword')?.touched"
                    [class.border-red-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                    placeholder="Confirm password"
                  />
                  @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
                    <p class="text-red-400 text-xs mt-1.5 flex items-center">
                      <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                        Please confirm your password
                      }
                      @if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                        Passwords do not match
                      }
                    </p>
                  }
                </div>

                <!-- Error Message -->
                @if (error) {
                  <div class="stagger-5 animate-fade-in-up p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p class="text-red-400 text-sm flex items-start">
                      <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                      </svg>
                      {{ error }}
                    </p>
                  </div>
                }

                <!-- Submit Button -->
                <button
                  type="submit"
                  [disabled]="registerForm.invalid || loading"
                  class="stagger-6 animate-fade-in-up w-full py-3.5 px-4 btn-glow text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mt-6"
                >
                  @if (loading) {
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  } @else {
                    <span class="flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                      </svg>
                      Create Account
                    </span>
                  }
                </button>
              </form>

              <!-- Login Link -->
              <div class="stagger-7 animate-fade-in-up mt-6 pt-6 border-t border-slate-700/50 text-center">
                <p class="text-slate-400 text-sm">
                  Already have credentials?
                  <a routerLink="/login" class="text-cyan-400 hover:text-cyan-300 font-medium ml-1 transition-colors">
                    Access System
                  </a>
                </p>
              </div>
            </div>
          </div>

          <!-- Right side: Branding -->
          <div class="hidden lg:block lg:order-1 animate-fade-in">
            <div class="space-y-6">
              <div class="flex items-center space-x-3 mb-8">
                <div class="relative">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="absolute -inset-1 rounded-xl bg-cyan-500/20 blur-md -z-10"></div>
                </div>
              </div>

              <h1 class="text-6xl font-bold tracking-tight">
                <span class="gradient-text">HY Monitor</span>
              </h1>

              <p class="text-2xl text-slate-300 font-light">
                Join the Monitoring Network
              </p>

              <p class="text-slate-400 text-lg leading-relaxed max-w-md">
                Get instant access to powerful monitoring tools. Track uptime, receive alerts, and maintain total control over your web infrastructure.
              </p>

              <!-- Feature list -->
              <div class="space-y-3 pt-8">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <svg class="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-slate-300">Real-time monitoring & alerts</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <svg class="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-slate-300">Comprehensive analytics dashboard</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <svg class="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-slate-300">Multi-site infrastructure control</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    displayName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  loading = false;
  error = '';

  // Custom validator to check if passwords match
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
      return null;
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const registerRequest: RegisterRequest = {
      username: this.registerForm.value.username!,
      password: this.registerForm.value.password!,
      displayName: this.registerForm.value.displayName!
    };

    this.authService.register(registerRequest).subscribe({
      next: () => {
        // Auto-login successful, redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.error = 'Username already exists. Please choose another.';
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Registration failed. Please try again.';
        }
        this.loading = false;
      }
    });
  }
}
