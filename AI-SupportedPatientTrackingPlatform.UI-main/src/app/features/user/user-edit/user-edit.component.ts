import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../../core/services/user.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="user-edit-container">
      <div *ngIf="isLoading" class="spinner-container">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!isLoading">
        <div class="header-actions">
          <button mat-icon-button matTooltip="Geri Dön" routerLink="/users">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h2>Kullanıcı Düzenle</h2>
        </div>
        
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <mat-card>
            <mat-card-content>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Ad</mat-label>
                  <input matInput formControlName="firstName">
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Soyad</mat-label>
                  <input matInput formControlName="lastName">
                </mat-form-field>
              </div>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Kullanıcı Adı</mat-label>
                <input matInput formControlName="username">
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>E-posta</mat-label>
                <input matInput formControlName="email">
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Rol</mat-label>
                <mat-select formControlName="role">
                  <mat-option [value]="UserRole.Admin">Yönetici</mat-option>
                  <mat-option [value]="UserRole.Doctor">Doktor</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Yeni Şifre (Boş bırakırsanız şifre değişmez)</mat-label>
                <input matInput type="password" formControlName="password">
              </mat-form-field>
            </mat-card-content>
            
            <mat-card-actions align="end">
              <button mat-button type="button" routerLink="/users">İptal</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid || isSaving">
                <mat-icon *ngIf="isSaving">
                  <mat-spinner diameter="20"></mat-spinner>
                </mat-icon>
                <span *ngIf="!isSaving">Kaydet</span>
              </button>
            </mat-card-actions>
          </mat-card>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .user-edit-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .header-actions h2 {
      margin: 0;
      margin-left: 10px;
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
    
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 50px 0;
    }
    
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class UserEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  
  UserRole = UserRole;
  userForm!: FormGroup;
  userId!: string;
  isLoading = true;
  isSaving = false;
  
  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = id;
        this.loadUser(id);
      } else {
        this.router.navigate(['/users']);
      }
    });
  }
  
  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [UserRole.Doctor, Validators.required],
      password: ['']
    });
  }
  
  loadUser(id: string): void {
    this.isLoading = true;
    
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kullanıcı yükleme hatası:', error);
        this.snackBar.open('Kullanıcı bilgileri yüklenirken bir hata oluştu', 'Kapat', {
          duration: 5000
        });
        this.router.navigate(['/users']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    
    this.isSaving = true;
    
    const userData = {...this.userForm.value};
    if (!userData.password) {
      delete userData.password;
    }
    
    this.userService.updateUser(this.userId, userData).subscribe({
      next: () => {
        this.snackBar.open('Kullanıcı başarıyla güncellendi', 'Kapat', {
          duration: 3000
        });
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Kullanıcı güncelleme hatası:', error);
        this.snackBar.open('Kullanıcı güncellenirken bir hata oluştu', 'Kapat', {
          duration: 5000
        });
        this.isSaving = false;
      }
    });
  }
}