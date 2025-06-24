import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { Patient } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-list',
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
    <div class="patient-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Hasta Listesi</mat-card-title>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" routerLink="/patients/new">
            <mat-icon>add</mat-icon> Yeni Hasta
          </button>
        </mat-card-header>
        
        <mat-card-content>
          <div class="search-container">
            <mat-form-field appearance="outline">
              <mat-label>Hasta Ara</mat-label>
              <input matInput [(ngModel)]="searchTerm" (input)="onSearchInput()">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div *ngIf="isLoading" class="spinner-container">
            <mat-spinner></mat-spinner>
          </div>
          
          <div *ngIf="!isLoading && patients.length === 0" class="no-data">
            <mat-icon>person_off</mat-icon>
            <p>
              <ng-container *ngIf="searchTerm">
                Arama sonucu bulunamadı
              </ng-container>
              <ng-container *ngIf="!searchTerm">
                Henüz hasta kaydı bulunmamaktadır
              </ng-container>
            </p>
            <button mat-stroked-button color="primary" routerLink="/patients/new">
              <mat-icon>add</mat-icon> Yeni Hasta Ekle
            </button>
          </div>
          
          <div *ngIf="!isLoading && patients.length > 0" class="mat-elevation-z2 table-container">
            <table mat-table [dataSource]="patients">
              
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let patient">{{ patient.id | slice:0:8 }}...</td>
              </ng-container>
              
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Ad Soyad</th>
                <td mat-cell *matCellDef="let patient">{{ patient.firstName }} {{ patient.lastName }}</td>
              </ng-container>
              
              <!-- Identification Number Column -->
              <ng-container matColumnDef="identificationNumber">
                <th mat-header-cell *matHeaderCellDef>Kimlik No</th>
                <td mat-cell *matCellDef="let patient">{{ patient.identificationNumber }}</td>
              </ng-container>
              
              <!-- Gender Column -->
              <ng-container matColumnDef="gender">
                <th mat-header-cell *matHeaderCellDef>Cinsiyet</th>
                <td mat-cell *matCellDef="let patient">{{ getGenderDisplay(patient.gender) }}</td>
              </ng-container>
              
              <!-- Age Column -->
              <ng-container matColumnDef="age">
                <th mat-header-cell *matHeaderCellDef>Yaş</th>
                <td mat-cell *matCellDef="let patient">{{ calculateAge(patient.dateOfBirth) }}</td>
              </ng-container>
              
              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>İşlemler</th>
                <td mat-cell *matCellDef="let patient">
                  <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="İşlemler">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item [routerLink]="['/patients', patient.id]">
                      <mat-icon>visibility</mat-icon>
                      <span>Detay</span>
                    </button>
                    <button mat-menu-item [routerLink]="['/patients', patient.id, 'edit']">
                      <mat-icon>edit</mat-icon>
                      <span>Düzenle</span>
                    </button>
                    <button *ngIf="isAdmin" mat-menu-item (click)="confirmDelete(patient)">
                      <mat-icon>delete</mat-icon>
                      <span>Sil</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            
            <mat-paginator
              *ngIf="!searchMode"
              [length]="totalItems"
              [pageSize]="pageSize"
              [pageSizeOptions]="[5, 10, 25, 50]"
              (page)="onPageChange($event)"
              aria-label="Sayfa seçin">
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .patient-list-container {
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
    
    @media (max-width: 768px) {
      
      .mat-column-id, .mat-column-gender {
        display: none;
      }
    }
  `]
})
export class PatientListComponent implements OnInit, OnDestroy {
  private patientService = inject(PatientService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'name', 'identificationNumber', 'gender', 'age', 'actions'];
  patients: Patient[] = [];
  isLoading = true;
  searchTerm = '';
  searchMode = false;
  
  // Pagination
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  
  get isAdmin(): boolean {
    return this.authService.hasRole('Admin');
  }
  
  ngOnInit(): void {
    this.loadPatients();
    
 
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(term => {
      this.performSearch(term);
    });
  }
  
  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
  
  loadPatients(): void {
    this.isLoading = true;
    this.searchMode = false;
    
    this.patientService.getPatients(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response) => {
        this.patients = response.items;
        this.totalItems = response.totalCount;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.snackBar.open('Hastalar yüklenirken bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
  
  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }
  
  performSearch(term: string): void {
    if (!term.trim()) {
      this.loadPatients();
      return;
    }
    
    this.isLoading = true;
    this.searchMode = true;
    
    this.patientService.searchPatients(term).subscribe({
      next: (patients) => {
        this.patients = patients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching patients:', error);
        this.snackBar.open('Hasta arama sırasında bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPatients();
  }
  
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  
  getGenderDisplay(gender: string): string {
    switch (gender) {
      case 'Male':
        return 'Erkek';
      case 'Female':
        return 'Kadın';
      case 'Other':
        return 'Diğer';
      case 'PreferNotToSay':
        return 'Belirtmek istemiyor';
      default:
        return gender;
    }
  }
  
  confirmDelete(patient: Patient): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Hasta Silme',
        message: `${patient.firstName} ${patient.lastName} adlı hastayı silmek istediğinize emin misiniz?`,
        confirmButtonText: 'Sil',
        cancelButtonText: 'İptal'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePatient(patient.id);
      }
    });
  }
  
  deletePatient(id: string): void {
    this.patientService.deletePatient(id).subscribe({
      next: () => {
        this.snackBar.open('Hasta başarıyla silindi', 'Kapat', {
          duration: 3000
        });
        this.loadPatients();
      },
      error: (error) => {
        console.error('Error deleting patient:', error);
        this.snackBar.open('Hasta silinirken bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}