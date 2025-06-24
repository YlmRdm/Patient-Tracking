import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Patient } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { PatientNoteListComponent } from '../patient-note-list/patient-note-list.component';
import { PatientPredictionComponent } from '../patient-prediction/patient-prediction.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    PatientNoteListComponent,
    PatientPredictionComponent
  ],
  template: `
    <div class="patient-detail-container">
      @if (isLoading) {
        <div class="spinner-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (!patient) {
        <mat-card>
          <mat-card-content>
            <div class="not-found">
              <mat-icon>error_outline</mat-icon>
              <h2>Hasta bulunamadı</h2>
              <p>Aradığınız hasta sistemde bulunamadı.</p>
              <button mat-raised-button color="primary" routerLink="/patients">
                <mat-icon>list</mat-icon> Hasta Listesine Dön
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="header-actions">
          <button mat-icon-button matTooltip="Geri Dön" routerLink="/patients">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" [routerLink]="['/patients', patient.id, 'edit']">
            <mat-icon>edit</mat-icon> Düzenle
          </button>
          @if (isAdmin) {
            <button mat-raised-button color="warn" (click)="confirmDelete()">
              <mat-icon>delete</mat-icon> Sil
            </button>
          }
        </div>

        <div class="patient-info">
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ patient.firstName }} {{ patient.lastName }}</mat-card-title>
              <mat-card-subtitle>Kimlik No: {{ patient.identificationNumber }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="info-section">
                <h3>Kişisel Bilgiler</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Yaş</span>
                    <span class="value">{{ calculateAge(patient.dateOfBirth) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Doğum Tarihi</span>
                    <span class="value">{{ patient.dateOfBirth | date:'dd.MM.yyyy' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Cinsiyet</span>
                    <span class="value">{{ getGenderDisplay(patient.gender) }}</span>
                  </div>
                </div>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="info-section">
                <h3>İletişim Bilgileri</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Telefon</span>
                    <span class="value">{{ patient.contactInformation.phoneNumber }}</span>
                  </div>
                  @if (patient.contactInformation.email) {
                    <div class="info-item">
                      <span class="label">E-posta</span>
                      <span class="value">{{ patient.contactInformation.email }}</span>
                    </div>
                  }
                </div>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="info-section">
                <h3>Adres Bilgileri</h3>
                <p>{{ patient.address.street }}, {{ patient.address.city }}, {{ patient.address.state }} {{ patient.address.zipCode }}, {{ patient.address.country }}</p>
              </div>
              
              @if (patient.contactInformation.emergencyContactName) {
                <mat-divider></mat-divider>
                
                <div class="info-section">
                  <h3>Acil Durum İletişim</h3>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="label">İsim</span>
                      <span class="value">{{ patient.contactInformation.emergencyContactName }}</span>
                    </div>
                    @if (patient.contactInformation.emergencyContactPhone) {
                      <div class="info-item">
                        <span class="label">Telefon</span>
                        <span class="value">{{ patient.contactInformation.emergencyContactPhone }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
              
              @if (patient.medicalHistory) {
                <mat-divider></mat-divider>
                
                <div class="info-section">
                  <h3>Tıbbi Geçmiş</h3>
                  <p class="medical-history">{{ patient.medicalHistory }}</p>
                </div>
              }
            </mat-card-content>
          </mat-card>
        </div>

        <div class="patient-tabs">
          <mat-tab-group dynamicHeight>
            <mat-tab label="Hasta Notları">
              <app-patient-note-list [patientId]="patient.id"></app-patient-note-list>
            </mat-tab>
            <mat-tab label="Tahminler">
              <app-patient-prediction [patientId]="patient.id"></app-patient-prediction>
            </mat-tab>
          </mat-tab-group>
        </div>
      }
    </div>
  `,
  styles: [`
    .patient-detail-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .header-actions button {
      margin-left: 10px;
    }
    
    .spacer {
      flex: 1;
    }
    
    .patient-info {
      margin-bottom: 20px;
    }
    
    .info-section {
      margin: 20px 0;
    }
    
    .info-section h3 {
      color: #3f51b5;
      font-size: 18px;
      margin-bottom: 10px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .label {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .value {
      font-size: 16px;
    }
    
    .medical-history {
      white-space: pre-line;
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 50px 0;
    }
    
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 0;
      text-align: center;
    }
    
    .not-found mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 20px;
      color: #f44336;
    }
    
    mat-divider {
      margin: 20px 0;
    }
    
    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  patient: Patient | null = null;
  isLoading = true;
  
  get isAdmin(): boolean {
    return this.authService.hasRole('Admin');
  }
  
  ngOnInit(): void {
    this.loadPatient();
  }
  
  loadPatient(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          return of(null);
        }
        
        this.isLoading = true;
        return this.patientService.getPatientById(id);
      }),
      catchError(error => {
        console.error('Error loading patient:', error);
        this.snackBar.open('Hasta bilgileri yüklenirken bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return of(null);
      })
    ).subscribe(patient => {
      this.patient = patient;
      this.isLoading = false;
    });
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
  
  confirmDelete(): void {
    if (!this.patient) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Hasta Silme',
        message: `${this.patient.firstName} ${this.patient.lastName} adlı hastayı silmek istediğinize emin misiniz?`,
        confirmButtonText: 'Sil',
        cancelButtonText: 'İptal'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.patient) {
        this.deletePatient(this.patient.id);
      }
    });
  }
  
  deletePatient(id: string): void {
    this.patientService.deletePatient(id).subscribe({
      next: () => {
        this.snackBar.open('Hasta başarıyla silindi', 'Kapat', {
          duration: 3000
        });
        this.router.navigate(['/patients']);
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