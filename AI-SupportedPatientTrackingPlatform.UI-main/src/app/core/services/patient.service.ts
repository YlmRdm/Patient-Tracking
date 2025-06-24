import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUpdatePatientDto, Patient } from '../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/patients`;

  getPatients(pageNumber = 1, pageSize = 10): Observable<{ items: Patient[], pageNumber: number, totalPages: number, totalCount: number }> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<{ items: Patient[], pageNumber: number, totalPages: number, totalCount: number }>(
      this.API_URL,
      { params }
    );
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.API_URL}/${id}`);
  }

  searchPatients(searchTerm: string): Observable<Patient[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<Patient[]>(`${this.API_URL}/search`, { params });
  }


  createPatient(patient: CreateUpdatePatientDto): Observable<string> {
    return this.http.post<string>(this.API_URL, patient)
      .pipe(
        catchError((error: unknown) => {
          console.error('Hasta oluşturma hatası:', error);
          return throwError(() => error);
        })
      );
  }

  updatePatient(id: string, patient: CreateUpdatePatientDto): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}`, patient);
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}