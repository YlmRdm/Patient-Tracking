import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="profile-container">
      <h1>Profil Bilgileri</h1>
      
      <div *ngIf="isLoading" class="spinner-container">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!isLoading" class="profile-content">
        <mat-card class="info-card">
          <mat-card-header>
            <div class="avatar-container">
              <div class="avatar">
                <mat-icon class="avatar-icon">account_circle</mat-icon>
              </div>
              <div class="user-role">{{ getUserRole() }}</div>
            </div>
          </mat-card-header>
          
          <mat-card-content>
            <div class="user-info">
              <h2>{{ user?.firstName }} {{ user?.lastName }}</h2>
              <p class="username">{{'@'}}{{ user?.username }}</p>
              <p class="email">{{ user?.email }}</p>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="account-info">
              <div class="info-item">
                <span class="label">Hesap Durumu</span>
                <span class="value">{{ user?.isActive ? 'Aktif' : 'Pasif' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Oluşturulma Tarihi</span>
                <span class="value">{{ user?.created | date:'dd.MM.yyyy' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>Bilgileri Güncelle</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Ad</mat-label>
                  <input matInput formControlName="firstName">
                  <mat-error *ngIf="firstName.invalid && (firstName.dirty || firstName.touched)">
                    <span *ngIf="firstName.errors?.['required']">
                      Ad zorunludur
                    </span>
                  </mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Soyad</mat-label>
                  <input matInput formControlName="lastName">
                  <mat-error *ngIf="lastName.invalid && (lastName.dirty || lastName.touched)">
                    <span *ngIf="lastName.errors?.['required']">
                      Soyad zorunludur
                    </span>
                  </mat-error>
                </mat-form-field>
              </div>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>E-posta</mat-label>
                <input matInput type="email" formControlName="email">
                <mat-error *ngIf="email.invalid && (email.dirty || email.touched)">
                  <span *ngIf="email.errors?.['required']">
                    E-posta zorunludur
                  </span>
                  <span *ngIf="email.errors?.['email']">
                    Geçerli bir e-posta adresi girin
                  </span>
                </mat-error>
              </mat-form-field>
              
              <div class="password-section">
                <h3>Şifre Değiştir</h3>
                <p class="password-hint">Şifrenizi değiştirmek istemiyorsanız alanları boş bırakın</p>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Yeni Şifre</mat-label>
                  <input matInput type="password" formControlName="password">
                  <mat-error *ngIf="password.invalid && (password.dirty || password.touched)">
                    <span *ngIf="password.errors?.['minlength']">
                      Şifre en az 6 karakter olmalıdır
                    </span>
                  </mat-error>
                </mat-form-field>
              </div>
              
              <div class="form-actions">
                <button 
                  mat-raised-button 
                  color="primary" 
                  type="submit" 
                  [disabled]="profileForm.invalid || isSaving">
                  <mat-icon *ngIf="isSaving">
                    <mat-spinner diameter="20"></mat-spinner>
                  </mat-icon>
                  <ng-container *ngIf="!isSaving">
                    <mat-icon>save</mat-icon>
                    Değişiklikleri Kaydet
                  </ng-container>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .profile-container h1 {
      margin-bottom: 20px;
      color: #3f51b5;
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 50px 0;
    }
    
    .profile-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 20px;
    }
    
    .info-card {
      height: fit-content;
    }
    
    .avatar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
    }
    
    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #3f51b5;
      margin-bottom: 10px;
    }
    
    .avatar-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: white;
    }
    
    .user-role {
      font-size: 14px;
      color: #666;
      background-color: #e0e0e0;
      padding: 4px 12px;
      border-radius: 16px;
    }
    
    .user-info {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .user-info h2 {
      margin-bottom: 5px;
      color: #333;
    }
    
    .username {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .email {
      font-size: 14px;
      color: #666;
    }
    
    .account-info {
      margin-top: 20px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
    }
    
    .label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .value {
      font-size: 14px;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
    }
    
    .form-row mat-form-field {
      flex: 1;
    }
    
    .full-width {
      width: 100%;
    }
    
    .password-section {
      margin-top: 20px;
    }
    
    .password-section h3 {
      margin-bottom: 5px;
      color: #333;
    }
    
    .password-hint {
      font-size: 12px;
      color: #666;
      margin-bottom: 15px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    mat-spinner {
      display: inline-block;
      margin-right: 5px;
    }
    
    @media (max-width: 768px) {
      .profile-content {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  
  user: User | null = null;
  isLoading = true;
  isSaving = false;
  
  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.minLength(6)]
  });
  
  get firstName() { return this.profileForm.get('firstName')!; }
  get lastName() { return this.profileForm.get('lastName')!; }
  get email() { return this.profileForm.get('email')!; }
  get password() { return this.profileForm.get('password')!; }
  
  ngOnInit(): void {
    this.loadUserData();
  }
  
  loadUserData(): void {
    this.isLoading = true;
    
    const userData = this.authService.getUserData();
    
    if (userData) {
      this.userService.getUserById(userData.id).subscribe({
        next: (user) => {
          this.user = user;
          this.populateForm(user);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user data:', error);
          this.snackBar.open('Kullanıcı bilgileri yüklenirken bir hata oluştu', 'Kapat', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          
          // Fallback to auth service data if API fails
          this.user = userData;
          this.populateForm(userData);
          this.isLoading = false;
        }
      });
    } else {
      this.snackBar.open('Kullanıcı bilgileri bulunamadı', 'Kapat', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
    }
  }
  
  populateForm(user: User): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  }
  
  getUserRole(): string {
    if (!this.user) return '';
    
    switch(this.user.role) {
      case 'Admin':
        return 'Yönetici';
      case 'Doctor':
        return 'Doktor';
      default:
        return this.user.role;
    }
  }
  
  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }
    
    this.isSaving = true;
    
    const updateData = {
      username: this.user?.username || '',
      email: this.email.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      role: this.user?.role as UserRole || UserRole.Doctor,
      ...(this.password.value ? { password: this.password.value } : {})
    };
    
    if (this.user) {
      this.userService.updateUser(this.user.id, updateData).subscribe({
        next: () => {
          const userData = this.authService.getUserData();
          if (userData) {
            const updatedUserData = {
              ...userData,
              firstName: this.firstName.value,
              lastName: this.lastName.value,
              email: this.email.value
            };
            
            localStorage.setItem('user_data', JSON.stringify(updatedUserData));
          }
          
          this.snackBar.open('Profil bilgileri başarıyla güncellendi', 'Kapat', {
            duration: 3000
          });
          
          this.password.setValue('');
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.snackBar.open('Profil güncellenirken bir hata oluştu', 'Kapat', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isSaving = false;
        }
      });
    }
  }
}