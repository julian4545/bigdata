import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Asegúrate de que la ruta al environment sea correcta

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}User`;  // Define la URL para el servicio de usuarios
  
  private apiUrl2 = `${environment.apiUrl}Sensor`;  // Define la URL para el servicio de usuarios
  private apiUrl1 = `${environment.apiUrl}DataCollectionDevice`; 

  constructor(private http: HttpClient) { }

  // Método para obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);  // Realiza una petición GET para obtener usuarios
  }
  getsensor(): Observable<any> {
    return this.http.get<any>(this.apiUrl2);  // Realiza una petición GET para obtener usuarios
  }
  // Método para obtener un usuario por ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);  // Petición GET con el ID del usuario
  }

  // Método para crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    const params = new HttpParams()
      .set('username', userData.username)
      .set('password', userData.password)
      .set('fullName', userData.fullName)
      .set('email', userData.email)
      .set('phone', userData.phone)
      .set('address', userData.address);

    return this.http.post<any>(this.apiUrl, null, { params }); // Enviando null en el cuerpo
  }

  // Método para actualizar un usuario por ID
  updateUser(id: number, userData: any): Observable<any> {
    const params = new HttpParams()
      .set('username', userData.username)
      .set('password', userData.password)
      .set('fullName', userData.fullName)
      .set('email', userData.email)
      .set('phone', userData.phone)
      .set('address', userData.address);

    return this.http.put<any>(`${this.apiUrl}/${id}`, null, { params }); // Enviando null en el cuerpo
  }

  // Método para eliminar un usuario por ID
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);  // Petición DELETE para eliminar el usuario
  }
  getDevices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl1}/devices`); // Asegúrate de que la URL sea correcta
  }
}
