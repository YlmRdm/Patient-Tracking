import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUpdateUserDto, User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/users`;

  getUsers(includeInactive = false): Observable<User[]> {
    const params = new HttpParams().set('includeInactive', includeInactive.toString());
    return this.http.get<User[]>(this.API_URL, { params });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  createUser(user: CreateUpdateUserDto): Observable<string> {
    return this.http.post<string>(this.API_URL, user);
  }

  updateUser(id: string, user: CreateUpdateUserDto): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}