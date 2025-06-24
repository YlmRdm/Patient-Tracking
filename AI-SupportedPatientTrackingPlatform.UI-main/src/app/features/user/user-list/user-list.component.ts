import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule
  ],
  template: `
    <div class="user-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Kullanıcı Listesi</mat-card-title>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" routerLink="/register">
            <mat-icon>add</mat-icon> Yeni Kullanıcı
          </button>
        </mat-card-header>
        
        <mat-card-content>
          <div class="search-container">
            <mat-form-field appearance="outline">
              <mat-label>Kullanıcı Ara</mat-label>
              <input matInput [(ngModel)]="searchTerm" (input)="onSearchInput()">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div *ngIf="isLoading" class="spinner-container">
            <mat-spinner></mat-spinner>
          </div>
          
          <div *ngIf="!isLoading && users.length === 0" class="no-data">
            <mat-icon>person_off</mat-icon>
            <p>
              <ng-container *ngIf="searchTerm">
                Arama sonucu bulunamadı
              </ng-container>
              <ng-container *ngIf="!searchTerm">
                Henüz kullanıcı kaydı bulunmamaktadır
              </ng-container>
            </p>
            <button mat-stroked-button color="primary" routerLink="/register">
              <mat-icon>add</mat-icon> Yeni Kullanıcı Ekle
            </button>
          </div>
          
          <div *ngIf="!isLoading && users.length > 0" class="mat-elevation-z2 table-container">
            <table mat-table [dataSource]="users">
              
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let user">{{ user.id | slice:0:8 }}...</td>
              </ng-container>
              
              <!-- Username Column -->
              <ng-container matColumnDef="username">
                <th mat-header-cell *matHeaderCellDef>Kullanıcı Adı</th>
                <td mat-cell *matCellDef="let user">{{ user.username }}</td>
              </ng-container>
              
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Ad Soyad</th>
                <td mat-cell *matCellDef="let user">{{ user.firstName }} {{ user.lastName }}</td>
              </ng-container>
              
              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>E-posta</th>
                <td mat-cell *matCellDef="let user">{{ user.email }}</td>
              </ng-container>
              
              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Rol</th>
                <td mat-cell *matCellDef="let user">{{ getRoleDisplay(user.role) }}</td>
              </ng-container>
              
              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Durum</th>
                <td mat-cell *matCellDef="let user">
                  <span [ngClass]="{'active-status': user.isActive, 'inactive-status': !user.isActive}">
                    {{ user.isActive ? 'Aktif' : 'Pasif' }}
                  </span>
                </td>
              </ng-container>
              
              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>İşlemler</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="İşlemler">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="editUser(user)">
                      <mat-icon>edit</mat-icon>
                      <span>Düzenle</span>
                    </button>
                    <button mat-menu-item (click)="confirmDelete(user)" [disabled]="user.id === currentUserId">
                      <mat-icon>delete</mat-icon>
                      <span>Sil</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 20px;
    }
    
    mat-card {
      margin-bottom: 20px;
    }
    
    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .spacer {
      flex: 1;
    }
    
    .search-container {
      margin-bottom: 20px;
    }
    
    .search-container mat-form-field {
      width: 100%;
    }
    
    .table-container {
      margin-top: 20px;
      overflow-x: auto;
    }
    
    table {
      width: 100%;
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 50px 0;
    }
    
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 50px 0;
      color: #666;
    }
    
    .no-data mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
    
    .active-status {
      color: #4caf50;
      font-weight: 500;
    }
    
    .inactive-status {
      color: #f44336;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .mat-column-id, .mat-column-email {
        display: none;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  displayedColumns: string[] = ['id', 'username', 'name', 'email', 'role', 'status', 'actions'];
  users: User[] = [];
  isLoading = true;
  searchTerm = '';
  currentUserId = '';
  
  ngOnInit(): void {
    const currentUser = this.authService.getUserData();
    if (currentUser) {
      this.currentUserId = currentUser.id;
    }
    
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.isLoading = true;
    console.log('Kullanıcılar yükleniyor...');
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Kullanıcılar yüklendi:', users);
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kullanıcı yükleme hatası:', error);
        this.snackBar.open('Kullanıcılar yüklenirken bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
  
  onSearchInput(): void {
    if (!this.searchTerm.trim()) {
      this.loadUsers();
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase();
    const filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(searchTermLower) ||
      user.firstName.toLowerCase().includes(searchTermLower) ||
      user.lastName.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower)
    );
    
    this.users = filteredUsers;
  }
  
  getRoleDisplay(role: string): string {
    switch (role) {
      case UserRole.Admin:
        return 'Yönetici';
      case UserRole.Doctor:
        return 'Doktor';
      default:
        return role;
    }
  }
  
  editUser(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }
  
  confirmDelete(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Kullanıcı Silme',
        message: `${user.firstName} ${user.lastName} adlı kullanıcıyı silmek istediğinize emin misiniz?`,
        confirmButtonText: 'Sil',
        cancelButtonText: 'İptal'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(user.id);
      }
    });
  }
  
  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.snackBar.open('Kullanıcı başarıyla silindi', 'Kapat', {
          duration: 3000
        });
        this.loadUsers();
      },
      error: (error) => {
        console.error('Kullanıcı silme hatası:', error);
        this.snackBar.open('Kullanıcı silinirken bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}