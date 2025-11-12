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

  eliminarEstudiante(matricula: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${matricula}`);
  }
}
