import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataCollectionDeviceService {
  private apiUrl = `${environment.apiUrl}DataCollectionDevice`;
  private apiUrl1 = `${environment.apiUrl}User`;
  private apiUrl2 = `${environment.apiUrl}collectedData`;

  constructor(private http: HttpClient) { }

  // Método para obtener todos los dispositivos
  getDataCollectionDevices(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl1);
  }

  // Método para obtener un dispositivo por ID
  getDataCollectionDeviceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para crear un nuevo dispositivo
  createDataCollectionDevice(deviceData: any): Observable<any> {
    // Crear parámetros de consulta
    const params = new HttpParams()
      .set('name', deviceData.name)
      .set('description', deviceData.description)
      .set('userId', deviceData.userId.toString());


    // Enviar la solicitud POST con parámetros y headers
    return this.http.post<any>(this.apiUrl, null, { params });
  }

  // Método para actualizar un dispositivo por ID usando parámetros de consulta
  updateDataCollectionDevice(id: number, deviceData: any): Observable<any> {
    const params = new HttpParams()
      .set('name', deviceData.name)
      .set('description', deviceData.description)
      .set('userId', deviceData.userId.toString());

    return this.http.put<any>(`${this.apiUrl}/${id}`, null, { params });
  }

  // Método para eliminar un dispositivo por ID
  deleteDataCollectionDevice(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getCollectedData(): Observable<any> {
    return this.http.get<any>(this.apiUrl2);  // Petición GET sin headers adicionales
  }
}
