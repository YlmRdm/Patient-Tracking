import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="welcome-card">
        <mat-card>
          <mat-card-content>
            <div class="welcome-content">
              <div class="welcome-text">
                <h1>Hoş Geldiniz, {{ currentUserName }}!</h1>
                <p>
                  Hasta Takip Platformu'na hoş geldiniz. Bu platformda hastalarınızı takip edebilir, 
                  notlar ekleyebilir ve AI destekli sağlık tahminleri alabilirsiniz.
                </p>
                <button mat-raised-button color="primary" routerLink="/patients">
                  <mat-icon>people</mat-icon>
                  Hasta Listesine Git
                </button>
              </div>
              <div class="welcome-image">
                <mat-icon class="hero-icon">health_and_safety</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="stats-cards">
        @if (isLoading) {
          <div class="loading-spinner">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else {
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-card-content">
                <mat-icon class="stat-icon" color="primary">people</mat-icon>
                <div class="stat-text">
                  <div class="stat-value">{{ stats.patientCount }}</div>
                  <div class="stat-label">Kayıtlı Hasta</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          @if (isAdmin) {
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-card-content">
                  <mat-icon class="stat-icon" color="accent">person</mat-icon>
                  <div class="stat-text">
                    <div class="stat-value">{{ stats.doctorCount }}</div>
                    <div class="stat-label">Doktor</div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          }
        }
      </div>

      <div class="recent-patients-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Son Eklenen Hastalar</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            @if (isLoading) {
              <div class="loading-spinner">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
            } @else if (recentPatients.length === 0) {
              <div class="no-data">
                <p>Henüz hasta kaydı bulunmamaktadır.</p>
              </div>
            } @else {
              <div class="recent-patients-list">
                @for (patient of recentPatients; track patient.id) {
                  <div class="recent-patient-item">
                    <div class="patient-info">
                      <div class="patient-name">{{ patient.firstName }} {{ patient.lastName }}</div>
                      <div class="patient-details">
                        <span>ID: {{ patient.id.substring(0, 8) }}...</span>
                        <span>Yaş: {{ calculateAge(patient.dateOfBirth) }}</span>
                      </div>
                    </div>
                    <div class="patient-actions">
                      <button 
                        mat-icon-button 
                        color="primary" 
                        [routerLink]="['/patients', patient.id]" 
                        matTooltip="Detayları Görüntüle">
                        <mat-icon>visibility</mat-icon>
                      </button>
                    </div>
                  </div>
                  @if (!$last) {
                    <mat-divider></mat-divider>
                  }
                }
              </div>
              
              <div class="view-all-link">
                <a mat-button color="primary" routerLink="/patients">
                  Tüm Hastaları Görüntüle
                  <mat-icon>arrow_forward</mat-icon>
                </a>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .welcome-card {
      margin-bottom: 20px;
    }
    
    .welcome-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .welcome-text {
      flex: 2;
    }
    
    .welcome-text h1 {
      color: #3f51b5;
      margin-bottom: 10px;
    }
    
    .welcome-text p {
      margin-bottom: 20px;
      color: #666;
    }
    
    .welcome-image {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    
    .hero-icon {
      font-size: 100px;
      height: 100px;
      width: 100px;
      color: #3f51b5;
    }
    
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .stat-card {
      border-radius: 8px;
    }
    
    .stat-card-content {
      display: flex;
      align-items: center;
    }
    
    .stat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-right: 20px;
    }
    
    .stat-text {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-size: 28px;
      font-weight: 500;
    }
    
    .stat-label {
      font-size: 14px;
      color: #666;
    }
    
    .recent-patients-section {
      margin-bottom: 20px;
    }
    
    .recent-patients-list {
      margin: 15px 0;
    }
    
    .recent-patient-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
    }
    
    .patient-info {
      display: flex;
      flex-direction: column;
    }
    
    .patient-name {
      font-weight: 500;
      font-size: 16px;
      margin-bottom: 5px;
    }
    
    .patient-details {
      font-size: 14px;
      color: #666;
    }
    
    .patient-details span {
      margin-right: 15px;
    }
    
    .view-all-link {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
    }
    
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 30px 0;
    }
    
    .no-data {
      text-align: center;
      padding: 30px 0;
      color: #666;
    }
    
    @media (max-width: 768px) {
      .welcome-content {
        flex-direction: column;
      }
      
      .welcome-image {
        margin-top: 20px;
      }
      
      .stats-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private patientService = inject(PatientService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  
  isLoading = true;
  currentUserName = '';
  recentPatients: Patient[] = [];
  
  stats = {
    patientCount: 0,
    doctorCount: 0
  };
  
  get isAdmin(): boolean {
    return this.authService.hasRole('Admin');
  }
  
  ngOnInit(): void {
    const currentUser = this.authService.getUserData();
    this.currentUserName = currentUser ? currentUser.firstName : '';
    
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    
  
    forkJoin({
      patients: this.patientService.getPatients(1, 5),
      doctors: this.isAdmin ? this.getDoctorsCount() : of(0),
    }).subscribe({
      next: (results) => {
        this.stats.patientCount = results.patients.totalCount;
        this.stats.doctorCount = results.doctors;
        this.recentPatients = results.patients.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }
  
  getDoctorsCount(): Observable<number> {
    return this.userService.getUsers().pipe(
      map(users => users.filter(user => user.role === 'Doctor').length),
      catchError(error => {
        console.error('Error getting doctors count:', error);
        return of(0);
      })
    );
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
}