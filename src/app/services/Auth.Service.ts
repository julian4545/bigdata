// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false; // Estado de autenticación

  constructor(private router: Router) {}

  // Método para iniciar sesión
  login(email: string, password: string): void {
    // Aquí puedes añadir lógica para autenticar al usuario con un backend
    // Por ahora solo simularemos una autenticación exitosa
    this.isAuthenticated = true;
    localStorage.setItem('user', JSON.stringify({ email })); // Guarda el usuario en el almacenamiento local
  }

  // Método para cerrar sesión
  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('user'); // Elimina el usuario del almacenamiento local
    this.router.navigate(['/login']); // Redirige a la página de login
  }

  // Método para comprobar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticated; // Retorna el estado de autenticación
  }

  // Método para obtener el usuario actual (opcional)
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
