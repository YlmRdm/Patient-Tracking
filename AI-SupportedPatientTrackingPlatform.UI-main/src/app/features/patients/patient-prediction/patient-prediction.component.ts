import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Prediction } from '../../../core/models/prediction.model';
import { PredictionService } from '../../../core/services/prediction.service';

@Component({
  selector: 'app-patient-prediction',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="prediction-container">
      @if (isLoading) {
        <div class="spinner-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (!prediction) {
        <div class="no-prediction">
          <mat-icon>analytics</mat-icon>
          <p>Tahmin verisi henüz oluşturulmamış</p>
          <button mat-raised-button color="primary" (click)="loadPrediction()">
            <mat-icon>refresh</mat-icon> Tahmin Oluştur
          </button>
        </div>
      } @else {
        <div class="prediction-header">
          <h2>Hasta Tahmin Raporu</h2>
          <p class="subtitle">
            Oluşturulma: {{ prediction.generatedAt | date:'dd.MM.yyyy HH:mm' }} 
            <span class="model-version">Model: {{ prediction.modelVersion }}</span>
          </p>
          
          <div class="risk-score">
            <div class="risk-label">Genel Risk Skoru</div>
            <div class="risk-value">
              <mat-progress-bar 
                mode="determinate" 
                [value]="prediction.riskScore * 100"
                [color]="getRiskColor(prediction.riskScore)">
              </mat-progress-bar>
              <span class="percentage">{{ (prediction.riskScore * 100).toFixed(0) }}%</span>
            </div>
          </div>
        </div>
        
        <mat-divider></mat-divider>
        
        <div class="predictions-list">
          <h3>Olası Durumlar</h3>
          
          @for (condition of prediction.predictions; track condition.condition) {
            <div class="prediction-item">
              <div class="condition-header">
                <div class="condition-name">{{ condition.condition }}</div>
                <div class="condition-prob">{{ (condition.probability * 100).toFixed(0) }}%</div>
              </div>
              
              <mat-progress-bar 
                mode="determinate" 
                [value]="condition.probability * 100"
                [color]="getConditionColor(condition.probability)">
              </mat-progress-bar>
              
              <div class="condition-details">
                <div class="severity">
                  <span class="label">Şiddet Skoru:</span>
                  <span class="value" [style.color]="getSeverityColor(condition.severityScore)">
                    {{ (condition.severityScore * 100).toFixed(0) }}%
                  </span>
                </div>
                
                <div class="recommendation">
                  <span class="label">Önerilen Eylem:</span>
                  <span class="value">{{ condition.recommendedAction }}</span>
                </div>
              </div>
            </div>
          }
        </div>
        
        <div class="actions">
          <button mat-raised-button color="primary" (click)="loadPrediction()">
            <mat-icon>refresh</mat-icon> Yenile
          </button>
        </div>
        
        <div class="disclaimer">
          <mat-icon color="warn" matTooltip="Bu tahminler yalnızca bilgilendirme amaçlıdır ve tıbbi teşhis yerine geçmez.">info</mat-icon>
          <span>Bu tahminler yapay zeka destekli analiz sonuçlarıdır ve kesinlikle tıbbi teşhis yerine geçmez.</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .prediction-container {
      margin-top: 20px;
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 50px 0;
    }
    
    .no-prediction {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 50px 0;
      color: #666;
    }
    
    .no-prediction mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
    
    .prediction-header {
      margin-bottom: 20px;
    }
    
    .prediction-header h2 {
      margin-bottom: 5px;
      color: #3f51b5;
    }
    
    .subtitle {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .model-version {
      margin-left: 15px;
      font-style: italic;
    }
    
    .risk-score {
      margin: 20px 0;
    }
    
    .risk-label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .risk-value {
      display: flex;
      align-items: center;
    }
    
    .percentage {
      margin-left: 10px;
      font-weight: bold;
    }
    
    .predictions-list {
      margin: 20px 0;
    }
    
    .predictions-list h3 {
      margin-bottom: 15px;
      color: #3f51b5;
    }
    
    .prediction-item {
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 4px;
      background-color: #f5f5f5;
    }
    
    .condition-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .condition-name {
      font-weight: bold;
      font-size: 16px;
    }
    
    .condition-prob {
      font-weight: bold;
      font-size: 16px;
    }
    
    .condition-details {
      margin-top: 10px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .severity, .recommendation {
      display: flex;
      flex-direction: column;
    }
    
    .label {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .value {
      font-size: 15px;
    }
    
    .actions {
      margin: 20px 0;
      display: flex;
      justify-content: center;
    }
    
    .disclaimer {
      margin-top: 30px;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #666;
    }
    
    @media (max-width: 768px) {
      .condition-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PatientPredictionComponent implements OnInit {
  @Input() patientId!: string;
  
  private predictionService = inject(PredictionService);
  private snackBar = inject(MatSnackBar);
  
  prediction: Prediction | null = null;
  isLoading = true;
  
  ngOnInit(): void {
    this.loadPrediction();
  }
  
  loadPrediction(): void {
    this.isLoading = true;
    
    this.predictionService.getPrediction(this.patientId).subscribe({
      next: (prediction) => {
        this.prediction = prediction;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading prediction:', error);
        this.snackBar.open('Tahmin verileri yüklenirken bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.prediction = null;
        this.isLoading = false;
      }
    });
  }
  
  getRiskColor(score: number): 'primary' | 'accent' | 'warn' {
    if (score < 0.3) return 'primary';
    if (score < 0.6) return 'accent';
    return 'warn';
  }
  
  getConditionColor(probability: number): 'primary' | 'accent' | 'warn' {
    if (probability < 0.3) return 'primary';
    if (probability < 0.6) return 'accent';
    return 'warn';
  }
  
  getSeverityColor(severity: number): string {
    if (severity < 0.3) return '#4caf50';
    if (severity < 0.6) return '#ff9800';
    return '#f44336';
  }
}