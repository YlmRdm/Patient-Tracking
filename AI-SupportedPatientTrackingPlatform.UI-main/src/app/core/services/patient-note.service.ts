import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUpdateNoteDto, PatientNote } from '../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientNoteService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/patients`;

  getPatientNotes(patientId: string): Observable<PatientNote[]> {
    return this.http.get<PatientNote[]>(`${this.API_URL}/${patientId}/notes`);
  }

  getNoteById(patientId: string, noteId: string): Observable<PatientNote> {
    return this.http.get<PatientNote>(`${this.API_URL}/${patientId}/notes/${noteId}`);
  }

  createNote(patientId: string, note: CreateUpdateNoteDto): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/${patientId}/notes`, note);
  }

  updateNote(patientId: string, noteId: string, note: CreateUpdateNoteDto): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${patientId}/notes/${noteId}`, note);
  }
}