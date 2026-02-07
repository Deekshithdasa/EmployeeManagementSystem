import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if user is logged in and has HR or Admin role
    if (this.authService.isLoggedIn() && this.authService.isHROrAdmin()) {
      return true;
    }

    // Redirect to login if not authenticated or not authorized
    this.router.navigate(['/login']);
    return false;
  }
}
