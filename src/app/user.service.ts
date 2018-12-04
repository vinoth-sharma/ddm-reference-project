import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private serviceUrl = "localhost:8000/roles_and_responsibilities/";
  
  // private serviceUrl = "src\app\db.json"; private http:HttpClient
  constructor() { }

  // getUser():Observable<User[]> {
  // return this.http.get<User[]>(this.serviceUrl);

  }



