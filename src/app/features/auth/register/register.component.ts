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
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .animate-fade-in {
      animation: fade-in 0.4s ease-out;
    }
  `],
  template: `
    <div class="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md animate-fade-in">
        <!-- Card -->
        <div class="bg-white border border-stone-200 shadow-sm rounded-xl p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="font-serif text-3xl text-stone-800 mb-2">HY Monitor</h1>
            <p class="text-stone-500 text-sm">Create your account</p>
          </div>

          <!-- Register Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-stone-700 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="w-full bg-white border rounded-lg px-4 py-3 outline-none transition-all text-stone-800 placeholder-stone-400"
                [class.border-stone-300]="!registerForm.get('username')?.invalid || !registerForm.get('username')?.touched"
                [class.focus:border-teal-600]="!registerForm.get('username')?.invalid || !registerForm.get('username')?.touched"
                [class.focus:ring-1]="!registerForm.get('username')?.invalid || !registerForm.get('username')?.touched"
                [class.focus:ring-teal-600]="!registerForm.get('username')?.invalid || !registerForm.get('username')?.touched"
                [class.border-red-400]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                placeholder="Enter username"
              />
              @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
                <p class="text-red-500 text-xs mt-1.5 flex items-center">
                  <svg class="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
            <div>
              <label for="displayName" class="block text-sm font-medium text-stone-700 mb-1.5">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                formControlName="displayName"
                class="w-full bg-white border rounded-lg px-4 py-3 outline-none transition-all text-stone-800 placeholder-stone-400"
                [class.border-stone-300]="!registerForm.get('displayName')?.invalid || !registerForm.get('displayName')?.touched"
                [class.focus:border-teal-600]="!registerForm.get('displayName')?.invalid || !registerForm.get('displayName')?.touched"
                [class.focus:ring-1]="!registerForm.get('displayName')?.invalid || !registerForm.get('displayName')?.touched"
                [class.focus:ring-teal-600]="!registerForm.get('displayName')?.invalid || !registerForm.get('displayName')?.touched"
                [class.border-red-400]="registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched"
                placeholder="Enter display name"
              />
              @if (registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched) {
                <p class="text-red-500 text-xs mt-1.5 flex items-center">
                  <svg class="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Display name is required
                </p>
              }
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full bg-white border rounded-lg px-4 py-3 outline-none transition-all text-stone-800 placeholder-stone-400"
                [class.border-stone-300]="!registerForm.get('password')?.invalid || !registerForm.get('password')?.touched"
                [class.focus:border-teal-600]="!registerForm.get('password')?.invalid || !registerForm.get('password')?.touched"
                [class.focus:ring-1]="!registerForm.get('password')?.invalid || !registerForm.get('password')?.touched"
                [class.focus:ring-teal-600]="!registerForm.get('password')?.invalid || !registerForm.get('password')?.touched"
                [class.border-red-400]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                placeholder="Enter password"
              />
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="text-red-500 text-xs mt-1.5 flex items-center">
                  <svg class="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-stone-700 mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="w-full bg-white border rounded-lg px-4 py-3 outline-none transition-all text-stone-800 placeholder-stone-400"
                [class.border-stone-300]="!registerForm.get('confirmPassword')?.invalid || !registerForm.get('confirmPassword')?.touched"
                [class.focus:border-teal-600]="!registerForm.get('confirmPassword')?.invalid || !registerForm.get('confirmPassword')?.touched"
                [class.focus:ring-1]="!registerForm.get('confirmPassword')?.invalid || !registerForm.get('confirmPassword')?.touched"
                [class.focus:ring-teal-600]="!registerForm.get('confirmPassword')?.invalid || !registerForm.get('confirmPassword')?.touched"
                [class.border-red-400]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                placeholder="Confirm password"
              />
              @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
                <p class="text-red-500 text-xs mt-1.5 flex items-center">
                  <svg class="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
              <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm flex items-start">
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
              [disabled]="registerForm.invalid || loading"
              class="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              @if (loading) {
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                Create Account
              }
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 pt-6 border-t border-stone-200 text-center">
            <p class="text-stone-600 text-sm">
              Already have an account?
              <a routerLink="/login" class="text-teal-700 hover:text-teal-800 font-medium ml-1 transition-colors">
                Sign in
              </a>
            </p>
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
