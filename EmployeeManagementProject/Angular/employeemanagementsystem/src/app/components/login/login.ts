import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginModel } from '../../models/login';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginModel: LoginModel = {
    email: '',
    password: ''
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  loadingMessage: string = 'Logging in...';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.loginModel.email || !this.loginModel.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    // Email validation - must be valid email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.loginModel.email)) {
      this.errorMessage = 'Invalid email id';
      return;
    }

    // Check if email is one of the allowed HR/Admin emails
    const allowedEmails = ['hr@company.com', 'admin@company.com'];
    if (!allowedEmails.includes(this.loginModel.email.toLowerCase())) {
      this.errorMessage = 'Invalid email id';
      return;
    }

    // Check if using demo credentials first (faster path)
    if ((this.loginModel.email === 'hr@company.com' && this.loginModel.password === 'HRPass@2026!') ||
        (this.loginModel.email === 'admin@company.com' && this.loginModel.password === 'AdminPass@2026!')) {
      
      const role = this.loginModel.email === 'hr@company.com' ? 'HR' : 'ADMIN';
      this.isLoading = true;
      this.loadingMessage = 'Verifying credentials...';
      
      // Use demo login directly
      setTimeout(() => {
        this.handleDemoLogin(role);
      }, 500);
      return;
    }

    // For other credentials, show invalid password error
    this.errorMessage = 'Invalid email or password';
    return;
  }

  // Demo login for testing purposes
  private handleDemoLogin(role: string): void {
    try {
      const user = {
        id: 1,
        email: this.loginModel.email,
        role: role,
        name: role === 'HR' ? 'HR Manager' : 'Administrator'
      };
      
      // Update auth service with user data
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', 'demo-token-' + Date.now());
      
      // Manually update the auth service's current user
      (this.authService as any).currentUserSubject.next(user);
      
      this.successMessage = 'Login successful! Redirecting to Employee Management...';
      this.isLoading = false;
      this.errorMessage = '';
      
      // Navigate to employee list
      setTimeout(() => {
        this.router.navigate(['/list']).catch(err => {
          console.error('Navigation error:', err);
          window.location.href = '/list';
        });
      }, 1200);
    } catch (e) {
      console.error('Demo login error:', e);
      this.errorMessage = 'Login processing error. Please try again.';
      this.isLoading = false;
    }
  }

  // Test login with demo credentials
  demoLoginHR(): void {
    this.loginModel.email = 'hr@company.com';
    this.loginModel.password = 'password123';
    this.onLogin();
  }

  demoLoginAdmin(): void {
    this.loginModel.email = 'admin@company.com';
    this.loginModel.password = 'admin123';
    this.onLogin();
  }
}
