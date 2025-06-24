import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Prediction } from '../models/prediction.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/prediction`;

  getPrediction(patientId: string): Observable<Prediction> {
    return this.http.get<Prediction>(`${this.API_URL}/${patientId}`);
  }
}