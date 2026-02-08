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
    
    const storedUser = this.getUserFromStorage();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  
  login(loginModel: LoginModel): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginModel).pipe(
      tap(response => {
        
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

  
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  
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

  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === role;
  }

  
  isHROrAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && (user.role === 'HR' || user.role === 'ADMIN' || user.role === 'ADMINISTRATION');
  }

  
  getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}
