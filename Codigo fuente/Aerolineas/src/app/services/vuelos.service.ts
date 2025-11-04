import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vuelo {
  vuelo_id: number;
  numero_vuelo: string;
  fecha: string;        // ISO
  hora_salida: string;
  hora_llegada: string;
  origen: string;
  destino: string;
}

@Injectable({ providedIn: 'root' })
export class VuelosService {
  private apiUrl = 'http://localhost:3000/api/vuelos'; // sin proxy

  constructor(private http: HttpClient) {}

  getPorCodigo(codigo: string): Observable<Vuelo> {
    return this.http.get<Vuelo>(`${this.apiUrl}/${codigo}`);
  }
}