// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router'; // Importa Router para la redirección
import { AuthService } from 'src/app/services/Auth.Service';
import { UserService } from 'src/app/services/User.Service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  users: any[] = []; // Para almacenar la lista de usuarios

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService, // Inyección del servicio de autenticación
    private router: Router // Inyección del Router para redirección
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        console.log('Usuarios cargados:', this.users);
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      // Verificar si el usuario existe y las credenciales son correctas
      const user = this.users.find(user => user.email === email && user.password === password);
      if (user) {
        console.log('Inicio de sesión exitoso:', user);
        this.authService.login(email, password); // Marcar al usuario como autenticado en el servicio
        this.router.navigate(['/dashboard']); // Redirigir a la página de dashboard
      } else {
        console.error('Credenciales inválidas.');
      }
    } else {
      console.error('Formulario no válido');
    }
  }
}
