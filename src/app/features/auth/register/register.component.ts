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
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-3">
            <svg class="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">HY Monitor</h1>
          <p class="text-gray-500">Create your account</p>
        </div>

        <!-- Register Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <!-- Username Field -->
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              formControlName="username"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Choose a username"
              [class.border-red-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
            />
            @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
              @if (registerForm.get('username')?.errors?.['required']) {
                <p class="text-red-500 text-sm mt-1">Username is required</p>
              }
              @if (registerForm.get('username')?.errors?.['minlength']) {
                <p class="text-red-500 text-sm mt-1">Username must be at least 3 characters</p>
              }
            }
          </div>

          <!-- Display Name Field -->
          <div class="mb-4">
            <label for="displayName" class="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              formControlName="displayName"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Your display name"
              [class.border-red-500]="registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched"
            />
            @if (registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched) {
              <p class="text-red-500 text-sm mt-1">Display name is required</p>
            }
          </div>

          <!-- Password Field -->
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Choose a password"
              [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            />
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              @if (registerForm.get('password')?.errors?.['required']) {
                <p class="text-red-500 text-sm mt-1">Password is required</p>
              }
              @if (registerForm.get('password')?.errors?.['minlength']) {
                <p class="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
              }
            }
          </div>

          <!-- Confirm Password Field -->
          <div class="mb-6">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Confirm your password"
              [class.border-red-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
            />
            @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
              @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                <p class="text-red-500 text-sm mt-1">Please confirm your password</p>
              }
              @if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                <p class="text-red-500 text-sm mt-1">Passwords do not match</p>
              }
            }
          </div>

          <!-- Error Message -->
          @if (error) {
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-600 text-sm">{{ error }}</p>
            </div>
          }

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="registerForm.invalid || loading"
            class="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            @if (loading) {
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            } @else {
              <span>Register</span>
            }
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 text-sm">
            Already have an account?
            <a routerLink="/login" class="text-indigo-600 hover:text-indigo-800 font-medium">
              Login
            </a>
          </p>
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
