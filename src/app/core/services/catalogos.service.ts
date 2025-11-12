import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private baseUrl = 'http://localhost:3000/api/catalogos';

  constructor(private http: HttpClient) {}

  obtenerCatalogo(tipo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${tipo}`);
  }

  crearCatalogo(tipo: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${tipo}`, data);
  }

  actualizarCatalogo(tipo: string, id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${tipo}/${id}`, data);
  }

  eliminarCatalogo(tipo: string, id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${tipo}/${id}`);
  }
}
