import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PatientNote } from '../../../core/models/patient.model';
import { PatientNoteService } from '../../../core/services/patient-note.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-patient-note-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="note-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Hasta Notları</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="isLoading" class="spinner-container">
            <mat-spinner></mat-spinner>
          </div>
          
          <ng-container *ngIf="!isLoading">
            <div class="new-note-form">
              <form [formGroup]="noteForm" (ngSubmit)="addNote()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Yeni Not</mat-label>
                  <textarea matInput formControlName="content" placeholder="Hasta hakkında not ekleyin" rows="3"></textarea>
                  <mat-error *ngIf="content.invalid && (content.dirty || content.touched)">
                    <span *ngIf="content.errors?.['required']">
                      Not içeriği zorunludur
                    </span>
                    <span *ngIf="content.errors?.['maxlength']">
                      Not en fazla 5000 karakter olabilir
                    </span>
                  </mat-error>
                </mat-form-field>
                
                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit" [disabled]="noteForm.invalid || isSaving">
                    <ng-container *ngIf="isSaving">
                      <mat-spinner diameter="20"></mat-spinner>
                    </ng-container>
                    <ng-container *ngIf="!isSaving">
                      <mat-icon>add</mat-icon> Not Ekle
                    </ng-container>
                  </button>
                </div>
              </form>
            </div>
            
            <mat-divider></mat-divider>
            
            <div *ngIf="notes.length === 0" class="no-notes">
              <mat-icon>note_alt</mat-icon>
              <p>Henüz not bulunmamaktadır</p>
            </div>
            
            <div *ngIf="notes.length > 0" class="notes-list">
              <mat-expansion-panel *ngFor="let note of notes; trackBy: trackById">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    {{ note.doctorName }}
                  </mat-panel-title>
                  <mat-panel-description>
                    {{ note.created | date:'dd.MM.yyyy HH:mm' }}
                  </mat-panel-description>
                </mat-expansion-panel-header>
                
                <ng-container *ngIf="editingNoteId === note.id">
                  <form [formGroup]="editForm" (ngSubmit)="updateNote(note.id)">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Not Düzenle</mat-label>
                      <textarea matInput formControlName="content" rows="4"></textarea>
                      <mat-error *ngIf="editContent.invalid && (editContent.dirty || editContent.touched)">
                        <span *ngIf="editContent.errors?.['required']">
                          Not içeriği zorunludur
                        </span>
                        <span *ngIf="editContent.errors?.['maxlength']">
                          Not en fazla 5000 karakter olabilir
                        </span>
                      </mat-error>
                    </mat-form-field>
                    
                    <div class="edit-actions">
                      <button mat-button type="button" (click)="cancelEdit()">İptal</button>
                      <button mat-raised-button color="primary" type="submit" [disabled]="editForm.invalid || isUpdating">
                        <ng-container *ngIf="isUpdating">
                          <mat-spinner diameter="20"></mat-spinner>
                        </ng-container>
                        <ng-container *ngIf="!isUpdating">
                          Kaydet
                        </ng-container>
                      </button>
                    </div>
                  </form>
                </ng-container>
                
                <div *ngIf="editingNoteId !== note.id" class="note-content">
                  <p>{{ note.content }}</p>
                  
                  <button *ngIf="canEdit(note)" mat-icon-button color="primary" (click)="editNote(note)" matTooltip="Düzenle">
                    <mat-icon>edit</mat-icon>
                  </button>
                </div>
              </mat-expansion-panel>
            </div>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .note-list-container {
      margin-top: 20px;
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 30px 0;
    }
    
    .new-note-form {
      margin: 20px 0;
    }
    
    .full-width {
      width: 100%;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
    
    .notes-list {
      margin-top: 20px;
    }
    
    mat-expansion-panel {
      margin-bottom: 10px;
    }
    
    .note-content {
      position: relative;
    }
    
    .note-content p {
      white-space: pre-line;
      margin-bottom: 40px;
    }
    
    .note-content button {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    
    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }
    
    .no-notes {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 30px 0;
      color: #666;
    }
    
    .no-notes mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
    
    mat-spinner {
      display: inline-block;
      margin-right: 5px;
    }
  `]
})
export class PatientNoteListComponent implements OnInit {
  @Input() patientId!: string;
  
  private noteService = inject(PatientNoteService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  
  notes: PatientNote[] = [];
  isLoading = true;
  isSaving = false;
  isUpdating = false;
  
  noteForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(5000)]]
  });
  
  editForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(5000)]]
  });
  
  editingNoteId: string | null = null;
  
  get content() { return this.noteForm.get('content')!; }
  get editContent() { return this.editForm.get('content')!; }
  
  ngOnInit(): void {
    this.loadNotes();
  }
  
  loadNotes(): void {
    this.isLoading = true;
    
    this.noteService.getPatientNotes(this.patientId).subscribe({
      next: (notes) => {
        this.notes = notes.sort((a, b) => 
          new Date(b.created).getTime() - new Date(a.created).getTime()
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        this.snackBar.open('Notlar yüklenirken bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
  
  addNote(): void {
    if (this.noteForm.invalid) {
      return;
    }
    
    this.isSaving = true;
    
    this.noteService.createNote(this.patientId, { content: this.content.value }).subscribe({
      next: () => {
        this.snackBar.open('Not başarıyla eklendi', 'Kapat', {
          duration: 3000
        });
        this.noteForm.reset();
        this.loadNotes();
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error adding note:', error);
        this.snackBar.open('Not eklenirken bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isSaving = false;
      }
    });
  }
  
  editNote(note: PatientNote): void {
    this.editingNoteId = note.id;
    this.editForm.patchValue({
      content: note.content
    });
  }
  
  cancelEdit(): void {
    this.editingNoteId = null;
    this.editForm.reset();
  }
  
  updateNote(noteId: string): void {
    if (this.editForm.invalid) {
      return;
    }
    
    this.isUpdating = true;
    
    this.noteService.updateNote(this.patientId, noteId, { content: this.editContent.value }).subscribe({
      next: () => {
        this.snackBar.open('Not başarıyla güncellendi', 'Kapat', {
          duration: 3000
        });
        this.editingNoteId = null;
        this.editForm.reset();
        this.loadNotes();
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating note:', error);
        this.snackBar.open('Not güncellenirken bir hata oluştu', 'Kapat', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isUpdating = false;
      }
    });
  }
  
  canEdit(note: PatientNote): boolean {
    const currentUser = this.authService.getUserData();
    
    if (!currentUser) {
      return false;
    }
    
    if (this.authService.hasRole('Admin')) {
      return true;
    }
    
    return note.doctorId === currentUser.id;
  }
  
  trackById(index: number, note: PatientNote): string {
    return note.id;
  }
}