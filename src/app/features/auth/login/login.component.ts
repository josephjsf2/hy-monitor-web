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
  `],
  template: `
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a0e1a] via-[#121827] to-[#0a0e1a]">
      <!-- Animated background grid -->
      <div class="absolute inset-0 bg-grid-pattern"></div>

      <!-- Decorative gradient orbs -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-ring"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse-ring" style="animation-delay: 1s;"></div>

      <!-- Content Container -->
      <div class="relative z-10 min-h-screen flex items-center justify-start px-4 sm:px-8 lg:px-16">
        <div class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <!-- Left side: Branding -->
          <div class="hidden lg:block animate-fade-in">
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
                Website Monitoring Command Center
              </p>

              <p class="text-slate-400 text-lg leading-relaxed max-w-md">
                Real-time uptime monitoring, instant alerts, and comprehensive analytics for your web infrastructure.
              </p>

              <!-- Status indicators decoration -->
              <div class="flex items-center space-x-6 pt-8">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span class="text-sm text-slate-400">System Online</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style="animation-delay: 0.5s;"></div>
                  <span class="text-sm text-slate-400">Monitoring Active</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side: Login Form -->
          <div class="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto animate-fade-in-up">
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
                <h2 class="text-2xl font-semibold text-slate-100 mb-2">Access Control</h2>
                <p class="text-slate-400 text-sm">Enter your credentials to continue</p>
              </div>

              <!-- Login Form -->
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
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
                    [class.border-slate-700]="!loginForm.get('username')?.invalid || !loginForm.get('username')?.touched"
                    [class.border-red-500]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                    placeholder="Enter username"
                  />
                  @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                    <p class="text-red-400 text-xs mt-1.5 flex items-center">
                      <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      Username is required
                    </p>
                  }
                </div>

                <!-- Password Field -->
                <div class="stagger-2 animate-fade-in-up">
                  <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    formControlName="password"
                    class="w-full px-4 py-3 bg-slate-900/50 border rounded-lg outline-none transition-all duration-200 text-slate-100 placeholder-slate-500 input-glow"
                    [class.border-slate-700]="!loginForm.get('password')?.invalid || !loginForm.get('password')?.touched"
                    [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    placeholder="Enter password"
                  />
                  @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                    <p class="text-red-400 text-xs mt-1.5 flex items-center">
                      <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      Password is required
                    </p>
                  }
                </div>

                <!-- Error Message -->
                @if (error) {
                  <div class="stagger-3 animate-fade-in-up p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
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
                  [disabled]="loginForm.invalid || loading"
                  class="stagger-4 animate-fade-in-up w-full py-3.5 px-4 btn-glow text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  @if (loading) {
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  } @else {
                    <span class="flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                      </svg>
                      Access System
                    </span>
                  }
                </button>
              </form>

              <!-- Register Link -->
              <div class="stagger-5 animate-fade-in-up mt-6 pt-6 border-t border-slate-700/50 text-center">
                <p class="text-slate-400 text-sm">
                  Need access credentials?
                  <a routerLink="/register" class="text-cyan-400 hover:text-cyan-300 font-medium ml-1 transition-colors">
                    Request Account
                  </a>
                </p>
              </div>
            </div>
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
