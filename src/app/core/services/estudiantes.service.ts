import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from '../models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class EstudiantesService {
  private apiUrl = 'http://localhost:3000/api/estudiantes';

  constructor(private http: HttpClient) {}

  obtenerEstudiantes(): Observable<{ success: boolean; data: Estudiante[] }> {
    return this.http.get<{ success: boolean; data: Estudiante[] }>(this.apiUrl);
  }

  /**
   * 🚀 REGISTRAR (CREATE)
   * Publica un nuevo estudiante usando FormData.
   */
  registrarEstudiante(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  /**
   * 🚀 ACTUALIZAR (UPDATE)
   * Actualiza un estudiante existente por su matrícula.
   * Envía FormData por si se incluyen archivos nuevos.
   */
  actualizarEstudiante(matricula: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${matricula}`, formData);
  }

  /**
   * 🚀 ELIMINAR (DELETE)
   * Elimina un estudiante por su matrícula.
   */
  eliminarEstudiante(matricula: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${matricula}`);
  }
}