import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Ruta al archivo environment

@Injectable({
  providedIn: 'root'
})
export class CollectedDataService {

  private apiUrl = `${environment.apiUrl}CollectedData`; // Agrega 'CollectedData' a la URL de la API
  private apiUrl1 = `${environment.apiUrl}DataCollectionDevice`; 

  constructor(private http: HttpClient) { }

  getCollectedData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);  // Petición GET sin headers adicionales
  }
  getDevices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl1}`); // Asegúrate de que la URL sea correcta
  }
}
