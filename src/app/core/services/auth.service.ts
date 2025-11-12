import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth'; // 👈 ajusta según tu backend

  constructor(private http: HttpClient) {}

  /**
   * Realiza el login y guarda el token en localStorage
   */
  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { correo, contrasena }).pipe(
      tap((response: any) => {
        // 🔑 Guardar token y usuario en localStorage
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.usuario) {
          localStorage.setItem('user', JSON.stringify(response.usuario));
        }

        console.log('✅ Token guardado:', response.token);
      })
    );
  }

  /**
   * Cierra sesión eliminando token y usuario
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // retorna true si existe token
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtiene el usuario actual
   */
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
