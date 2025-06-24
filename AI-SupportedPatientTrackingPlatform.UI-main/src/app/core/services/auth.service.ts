import { HttpClient } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from '../models/auth.model';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();
  
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    if (this.isBrowser) {
      const token = this.getToken();
      const userData = this.getUserData();
      
      if (token && userData) {
        this.currentUserSubject.next(userData);
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response.success && this.isBrowser) {
          this.saveToken(response.token);
          this.saveUserData({
            id: response.id,
            username: response.userName,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            role: response.roles[0] as UserRole,
            isActive: true,
            created: new Date()
          });
          this.currentUserSubject.next(this.getUserData());
          this.tokenSubject.next(response.token);
        }
      })
    );
  }

  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, registerData);
  }

  logout(): Observable<boolean> {
    // Clear local storage and subjects (only in browser)
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    return of(true);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('auth_token');
  }

  getUserData(): User | null {
    if (!this.isBrowser) return null;
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  private saveToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem('auth_token', token);
  }

  private saveUserData(user: User): void {
    if (!this.isBrowser) return;
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  hasRole(role: string): boolean {
    const user = this.getUserData();
    return user ? user.role === role : false;
  }
}