import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';
import { CreateUpdatePatientDto, Gender, Patient } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';
import { switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  template: `
    <div class="patient-form-container">
      <div *ngIf="isLoading" class="spinner-container">
        <mat-spinner></mat-spinner>
      </div>
      
      <ng-container *ngIf="!isLoading">
        <div class="header-actions">
          <button mat-icon-button matTooltip="Geri Dön" routerLink="/patients">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h2>{{ isEditMode ? 'Hasta Düzenle' : 'Yeni Hasta Ekle' }}</h2>
        </div>

        <form [formGroup]="patientForm" (ngSubmit)="onSubmit()">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Kişisel Bilgiler</mat-card-title>
            </mat-card-header>
            <mat-card-content>
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

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Doğum Tarihi</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="dateOfBirth">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="dateOfBirth.invalid && (dateOfBirth.dirty || dateOfBirth.touched)">
                    <span *ngIf="dateOfBirth.errors?.['required']">
                      Doğum tarihi zorunludur
                    </span>
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Cinsiyet</mat-label>
                  <mat-select formControlName="gender">
                    <mat-option [value]="genderEnum.Male">Erkek</mat-option>
                    <mat-option [value]="genderEnum.Female">Kadın</mat-option>
                    <mat-option [value]="genderEnum.Other">Diğer</mat-option>
                    <mat-option [value]="genderEnum.PreferNotToSay">Belirtmek İstemiyorum</mat-option>
                  </mat-select>
                  <mat-error *ngIf="gender.invalid && (gender.dirty || gender.touched)">
                    <span *ngIf="gender.errors?.['required']">
                      Cinsiyet zorunludur
                    </span>
                  </mat-error>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Kimlik Numarası</mat-label>
                <input matInput formControlName="identificationNumber">
                <mat-error *ngIf="identificationNumber.invalid && (identificationNumber.dirty || identificationNumber.touched)">
                  <span *ngIf="identificationNumber.errors?.['required']">
                    Kimlik numarası zorunludur
                  </span>
                </mat-error>
              </mat-form-field>
            </mat-card-content>
          </mat-card>

          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>İletişim Bilgileri</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Telefon Numarası</mat-label>
                <input matInput formControlName="phoneNumber">
                <mat-error *ngIf="phoneNumber.invalid && (phoneNumber.dirty || phoneNumber.touched)">
                  <span *ngIf="phoneNumber.errors?.['required']">
                    Telefon numarası zorunludur
                  </span>
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>E-posta</mat-label>
                <input matInput type="email" formControlName="email">
                <mat-error *ngIf="email.invalid && (email.dirty || email.touched)">
                  <span *ngIf="email.errors?.['email']">
                    Geçerli bir e-posta adresi girin
                  </span>
                </mat-error>
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Acil Durum İletişim Adı</mat-label>
                  <input matInput formControlName="emergencyContactName">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Acil Durum İletişim Telefonu</mat-label>
                  <input matInput formControlName="emergencyContactPhone">
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>Adres Bilgileri</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Sokak/Cadde</mat-label>
                <input matInput formControlName="street">
                <mat-error *ngIf="street.invalid && (street.dirty || street.touched)">
                  <span *ngIf="street.errors?.['required']">
                    Sokak/Cadde bilgisi zorunludur
                  </span>
                </mat-error>
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Şehir</mat-label>
                  <input matInput formControlName="city">
                  <mat-error *ngIf="city.invalid && (city.dirty || city.touched)">
                    <span *ngIf="city.errors?.['required']">
                      Şehir bilgisi zorunludur
                    </span>
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>İlçe/Semt</mat-label>
                  <input matInput formControlName="state">
                  <mat-error *ngIf="state.invalid && (state.dirty || state.touched)">
                    <span *ngIf="state.errors?.['required']">
                      İlçe/Semt bilgisi zorunludur
                    </span>
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Posta Kodu</mat-label>
                  <input matInput formControlName="zipCode">
                  <mat-error *ngIf="zipCode.invalid && (zipCode.dirty || zipCode.touched)">
                    <span *ngIf="zipCode.errors?.['required']">
                      Posta kodu zorunludur
                    </span>
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Ülke</mat-label>
                  <input matInput formControlName="country">
                  <mat-error *ngIf="country.invalid && (country.dirty || country.touched)">
                    <span *ngIf="country.errors?.['required']">
                      Ülke bilgisi zorunludur
                    </span>
                  </mat-error>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>Tıbbi Bilgiler</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Tıbbi Geçmiş</mat-label>
                <textarea matInput formControlName="medicalHistory" rows="5" placeholder="Hastanın önceki hastalıkları, alerjileri veya önemli tıbbi durumlarını buraya girin"></textarea>
              </mat-form-field>
            </mat-card-content>
          </mat-card>

          <div class="form-actions">
            <button mat-button type="button" routerLink="/patients">İptal</button>
            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              [disabled]="patientForm.invalid || isSaving">
              <ng-container *ngIf="isSaving">
                <mat-spinner diameter="20"></mat-spinner>
              </ng-container>
              <ng-container *ngIf="!isSaving">
                <mat-icon>save</mat-icon>
                {{ isEditMode ? 'Güncelle' : 'Kaydet' }}
              </ng-container>
            </button>
          </div>
        </form>
      </ng-container>
    </div>
  `,
  styles: [`
    .patient-form-container {
      max-width: 900px;
      margin: 0 auto;
      padding-bottom: 40px;
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
    
    .section-card {
      margin-top: 20px;
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
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      gap: 10px;
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }
    
    mat-spinner {
      display: inline-block;
      margin-right: 5px;
    }
    
    @media (max-width: 599px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class PatientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  genderEnum = Gender;
  patientForm!: FormGroup;
  patientId: string | null = null;
  isEditMode = false;
  isLoading = true;
  isSaving = false;
  
  get firstName() { return this.patientForm.get('firstName')!; }
  get lastName() { return this.patientForm.get('lastName')!; }
  get dateOfBirth() { return this.patientForm.get('dateOfBirth')!; }
  get gender() { return this.patientForm.get('gender')!; }
  get identificationNumber() { return this.patientForm.get('identificationNumber')!; }
  get phoneNumber() { return this.patientForm.get('phoneNumber')!; }
  get email() { return this.patientForm.get('email')!; }
  get emergencyContactName() { return this.patientForm.get('emergencyContactName')!; }
  get emergencyContactPhone() { return this.patientForm.get('emergencyContactPhone')!; }
  get street() { return this.patientForm.get('street')!; }
  get city() { return this.patientForm.get('city')!; }
  get state() { return this.patientForm.get('state')!; }
  get zipCode() { return this.patientForm.get('zipCode')!; }
  get country() { return this.patientForm.get('country')!; }
  get medicalHistory() { return this.patientForm.get('medicalHistory')!; }
  
  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.patientId = id;
        this.isEditMode = id !== null && id !== 'new';
        
        if (this.isEditMode && this.patientId) {
          return this.patientService.getPatientById(this.patientId);
        }
        
        return of(null);
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
      if (patient) {
        this.populateForm(patient);
      }
      
      this.isLoading = false;
    });
  }
  
  initForm(): void {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      gender: [Gender.Male, Validators.required],
      identificationNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.email],
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['Türkiye', Validators.required],
      medicalHistory: ['']
    });
  }
  
  populateForm(patient: Patient): void {
    this.patientForm.patchValue({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: new Date(patient.dateOfBirth),
      gender: patient.gender,
      identificationNumber: patient.identificationNumber,
      phoneNumber: patient.contactInformation.phoneNumber,
      email: patient.contactInformation.email || '',
      emergencyContactName: patient.contactInformation.emergencyContactName || '',
      emergencyContactPhone: patient.contactInformation.emergencyContactPhone || '',
      street: patient.address.street,
      city: patient.address.city,
      state: patient.address.state,
      zipCode: patient.address.zipCode,
      country: patient.address.country,
      medicalHistory: patient.medicalHistory || ''
    });
  }
  
  onSubmit(): void {
    if (this.patientForm.invalid) {
      console.error('Form geçersiz:', this.patientForm.errors);
      
      // Her form kontrolünün hatalarını logla
      Object.keys(this.patientForm.controls).forEach(key => {
        const control = this.patientForm.get(key);
        if (control?.invalid) {
          console.error(`"${key}" alanında hatalar:`, control.errors);
        }
      });
      
      return;
    }
    
    this.isSaving = true;
    const formattedDate = this.dateOfBirth.value instanceof Date ? 
      this.dateOfBirth.value.toISOString() : 
      new Date(this.dateOfBirth.value).toISOString();
    
    const patientData: CreateUpdatePatientDto = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      dateOfBirth: formattedDate, 
      gender: this.gender.value,
      identificationNumber: this.identificationNumber.value,
      medicalHistory: this.medicalHistory.value,
      street: this.street.value,
      city: this.city.value,
      state: this.state.value,
      zipCode: this.zipCode.value,
      country: this.country.value,
      phoneNumber: this.phoneNumber.value,
      email: this.email.value,
      emergencyContactName: this.emergencyContactName.value,
      emergencyContactPhone: this.emergencyContactPhone.value
    };
    
    console.log('Gönderilecek hasta bilgileri:', patientData);
    
    if (this.isEditMode && this.patientId) {
      this.patientService.updatePatient(this.patientId, patientData).subscribe({
        next: () => {
          this.snackBar.open('Hasta başarıyla güncellendi', 'Kapat', {
            duration: 3000
          });
          this.router.navigate(['/patients', this.patientId]);
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error updating patient:', error);
          this.snackBar.open('Hasta güncellenirken bir hata oluştu', 'Kapat', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isSaving = false;
        }
      });
    } else {
      this.manualCreatePatient(patientData)
        .then(id => {
          console.log('Manuel istek başarılı, hasta ID:', id);
          this.snackBar.open('Hasta başarıyla eklendi', 'Kapat', {
            duration: 3000
          });
          this.router.navigate(['/patients', id]);
          this.isSaving = false;
        })
        .catch(error => {
          console.error('Manuel istek hatası:', error);
          this.snackBar.open('Hasta eklenirken bir hata oluştu', 'Kapat', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isSaving = false;
        });
    }
  }
  
  private manualCreatePatient(patient: CreateUpdatePatientDto): Promise<string> {
    const apiUrl = environment.apiUrl + '/patients';
    
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.error('Token bulunamadı!');
      return Promise.reject('Kimlik doğrulama token\'ı bulunamadı');
    }
    
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(patient)
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          console.error('API hata cevabı:', text);
          throw new Error('API hatası: ' + response.status + ' - ' + text);
        });
      }
      return response.text();
    });
  }
}