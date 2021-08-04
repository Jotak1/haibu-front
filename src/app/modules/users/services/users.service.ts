import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl: string = 'https://my-json-server.typicode.com/HaibuSolutions/prueba-tecnica-sf/user';

  constructor(private http: HttpClient) {
   }

   getDataUsers() {
    return this.http.get<any>(this.baseUrl);
  }
   getDataUser(id: number) {
    return this.http.get<any>(this.baseUrl+ '/' + id);
  }
}
