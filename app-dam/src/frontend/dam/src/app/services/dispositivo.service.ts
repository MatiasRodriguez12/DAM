import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Medicion } from '../models/medicion.interface';
@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  constructor(private _http: HttpClient) { }

  getDispositivos () {
    return firstValueFrom(this._http.get("http://localhost:8000/dispositivos"))
  }
  getUltimaMedicion(id: number): Promise<Medicion[]> {
    const url = `http://localhost:8000/ultima_medicion/${id}`;
    return firstValueFrom(this._http.get<Medicion[]>(url));
  }
  
  getMediciones(id: number): Promise<Medicion[]> {
    const url = `http://localhost:8000/mediciones/${id}`;
    return firstValueFrom(this._http.get<Medicion[]>(url));
  }

  getEstadoValvula(id: number): Promise<Medicion[]> {
    const url = `http://localhost:8000/obtener_estado_valvula/${id}`;
    return firstValueFrom(this._http.get<Medicion[]>(url));
  }

  getActualizarValvula(id: number,humedad: number,estado_valvula: number): Promise<{ mensaje: string }> {
    const url = `http://localhost:8000/actualizar_medicion/${id}/${humedad}/${estado_valvula}`;
    return firstValueFrom(this._http.get<{ mensaje: string }>(url));
  }
  
}
