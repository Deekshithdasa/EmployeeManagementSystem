import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginModel, LoginResponse, User } from '../models/login';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user exists in localStorage on service initialization
    const storedUser = this.getUserFromStorage();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  // Login method - calls backend API
  login(loginModel: LoginModel): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginModel).pipe(
      tap(response => {
        // Store user info in localStorage
        const user: User = {
          id: response.id,
          email: response.email,
          role: response.role,
          name: response.name
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', response.token || '');
        this.currentUserSubject.next(user);
      })
    );
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  // Get current user from storage
  private getUserFromStorage(): User | null {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        return JSON.parse(userString) as User;
      } catch (e) {
        console.error('Failed to parse user from storage', e);
        return null;
      }
    }
    return null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Check if user has required role
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === role;
  }

  // Check if user is HR or Admin
  isHROrAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && (user.role === 'HR' || user.role === 'ADMIN' || user.role === 'ADMINISTRATION');
  }

  // Get auth token
  getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}
