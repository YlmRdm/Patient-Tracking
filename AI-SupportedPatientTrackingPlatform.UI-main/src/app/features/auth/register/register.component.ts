import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Hasta Takip Platformu</mat-card-title>
          <mat-card-subtitle>Kayıt Ol</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Ad</mat-label>
                <input matInput formControlName="firstName" placeholder="Adınızı girin">
                @if (firstName.invalid && (firstName.dirty || firstName.touched)) {
                  <mat-error>
                    @if (firstName.errors?.['required']) {
                      Ad zorunludur
                    }
                  </mat-error>
                }
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Soyad</mat-label>
                <input matInput formControlName="lastName" placeholder="Soyadınızı girin">
                @if (lastName.invalid && (lastName.dirty || lastName.touched)) {
                  <mat-error>
                    @if (lastName.errors?.['required']) {
                      Soyad zorunludur
                    }
                  </mat-error>
                }
              </mat-form-field>
            </div>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Kullanıcı Adı</mat-label>
              <input matInput formControlName="username" placeholder="Kullanıcı adı girin">
              @if (username.invalid && (username.dirty || username.touched)) {
                <mat-error>
                  @if (username.errors?.['required']) {
                    Kullanıcı adı zorunludur
                  }
                </mat-error>
              }
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-posta</mat-label>
              <input matInput type="email" formControlName="email" placeholder="E-posta adresinizi girin">
              @if (email.invalid && (email.dirty || email.touched)) {
                <mat-error>
                  @if (email.errors?.['required']) {
                    E-posta zorunludur
                  } @else if (email.errors?.['email']) {
                    Geçerli bir e-posta adresi girin
                  }
                </mat-error>
              }
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Şifre</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Şifrenizi girin">
              @if (password.invalid && (password.dirty || password.touched)) {
                <mat-error>
                  @if (password.errors?.['required']) {
                    Şifre zorunludur
                  } @else if (password.errors?.['minlength']) {
                    Şifre en az 6 karakter olmalıdır
                  }
                </mat-error>
              }
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rol</mat-label>
              <mat-select formControlName="role">
                <mat-option [value]="UserRole.Doctor">Doktor</mat-option>
                <mat-option [value]="UserRole.Admin">Yönetici</mat-option>
              </mat-select>
              @if (role.invalid && (role.dirty || role.touched)) {
                <mat-error>
                  @if (role.errors?.['required']) {
                    Rol zorunludur
                  }
                </mat-error>
              }
            </mat-form-field>
            
            <div class="button-container">
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading">
                @if (isLoading) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  Kayıt Ol
                }
              </button>
              <a mat-button routerLink="/login">Giriş Yap</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }
    
    mat-card {
      max-width: 600px;
      width: 100%;
      padding: 20px;
    }
    
    .form-row {
      display: flex;
      gap: 15px;
    }
    
    .form-row mat-form-field {
      flex: 1;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .button-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
    
    mat-spinner {
      display: inline-block;
      margin-right: 5px;
    }
    
    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  UserRole = UserRole; // For template access
  
  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.Doctor, Validators.required]
  });
  
  isLoading = false;
  
  get firstName() { return this.registerForm.get('firstName')!; }
  get lastName() { return this.registerForm.get('lastName')!; }
  get username() { return this.registerForm.get('username')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get role() { return this.registerForm.get('role')!; }
  
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.snackBar.open(response.message || 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.', 'Kapat', {
          duration: 5000
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        
        if (error.error && error.error.errors) {
          const errorMessage = Array.isArray(error.error.errors) 
            ? error.error.errors.join(', ') 
            : Object.values(error.error.errors).flat().join(', ');
            
          this.snackBar.open(errorMessage || 'Kayıt sırasında bir hata oluştu', 'Kapat', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else {
          this.snackBar.open('Kayıt sırasında bir hata oluştu', 'Kapat', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}