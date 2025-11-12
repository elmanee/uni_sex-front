import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

onSubmit() {
  if (!this.correo || !this.contrasena) return;

  this.loading = true;
  this.error = '';

  this.authService.login(this.correo, this.contrasena).subscribe({
    next: (response) => {
      console.log('🔍 Respuesta del backend:', response); // 👈 AGREGA ESTO
      console.log('🔑 Token guardado:', localStorage.getItem('token')); // 👈 Y ESTO
      this.loading = false;
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error('❌ Error en login:', err); // 👈 Y ESTO
      this.loading = false;
      this.error = err.error?.mensaje || 'Credenciales incorrectas.';
    },
  });
}
}
