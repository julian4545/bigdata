// login.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from 'src/app/services/User.Service';
import { AuthService } from '../services/Auth.Service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Permitir el acceso
    } else {
      this.router.navigate(['/login']); // Redirigir a la página de login
      return false; // Denegar el acceso
    }
  }
}
