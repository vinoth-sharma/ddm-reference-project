import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData = [{username:'USER1',password:1723},
  {username:'USER2', password:1234},
  {username:'USER3',password:1236},
  {username:'USER4', password:1273},
  {username:'USER5', password:1223},
  {username:'USER10',password:1000}
];
public userid;
public slid;
myMethod$: Observable<any>; 
Method$: Observable<any>; 
errorMethod$: Observable<any>;
private myMethodSubject = new BehaviorSubject<any>("");

public slMethodSubject = new BehaviorSubject<any>(this.userid);
private isUserLoggedIn;
constructor(private http:HttpClient) {
    this.isUserLoggedIn = false;
    this.myMethod$ = this.myMethodSubject.asObservable();
    this.Method$ = this.slMethodSubject.asObservable();
    this.errorMethod$ = this.errorMethodSubject.asObservable();
  }
  private errorMethodSubject = new BehaviorSubject<any>("") 
  myMethod(userInformation, userid){
    console.log(userInformation);
    this.myMethodSubject.next(userInformation);
    this.slMethodSubject.next(userid);
  
  }
  errorMethod(userInformation) {
    this.errorMethodSubject.next(userInformation);
  }
  SetUserDetails(){
    this.isUserLoggedIn=true;
  }

    getUserDetails(){
      return this.isUserLoggedIn;
    };

    fun(userid: string){
      const serviceUrl = `http://localhost:8000/login/?userid=${userid}`; 
      return this.http.get(serviceUrl);

    }; 
    getTables(slid: number){
      const serviceUrl = `http://localhost:8000/semantic_layer/tables/?sl_id=0`; 
      return this.http.get(serviceUrl); 
    } 
    getSldetails(userid: string){
      const serviceUrl = `http://localhost:8000/semantic_layer/semantic_layers_details/?user_id=${userid}`; 
      return this.http.get(serviceUrl);
    } 

      getUser() {
      const serviceUrl = 'http://localhost:8000/roles_and_responsibilities/';
      return this.http.get(serviceUrl);
      console.log(this.userid);
      
    }
    
    // } 
     
}


