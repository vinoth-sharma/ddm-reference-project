import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData = [{username:'USER1',lastname:'biju', password:1723,roleid:'Viewers', rolename:'Viewers' },
  {username:'USER2',lastname:'kumari', password:1234, roleid:'Non-admin', rolename:'Non Administration'},
  {username:'USER3',lastname:'raut', password:1236, roleid:'Admin', rolename:'Administration'},
  {username:'USER4',lastname:'d', password:1273, roleid:'Viewers', rolename:'Viewers'},
  {username:'USER5',lastname:'gupta', password:1223, roleid:'Non-admin', rolename:'Non Administration'}
];
public userid;
public slid;
myMethod$: Observable<any>; 
Method$: Observable<any>; 
footmethod$: Observable<any>;
private myMethodSubject = new BehaviorSubject<any>("");
private footmethodSubject = new BehaviorSubject<any>("");

public slMethodSubject = new BehaviorSubject<any>(this.userid);

private isUserLoggedIn;

  constructor(private http:HttpClient) {
    this.isUserLoggedIn = false;
    this.myMethod$ = this.myMethodSubject.asObservable();
    this.Method$ = this.slMethodSubject.asObservable();
    this.footmethod$ = this.footmethodSubject.asObservable();
  }

  myMethod(userInformation, userid){
    console.log(userInformation);
    this.myMethodSubject.next(userInformation);
    this.slMethodSubject.next(userid);
    this.footmethodSubject.next(userInformation);
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
      // console.log(this.userid);

    }; 
    getTables(slid: number){
      const serviceUrl = `http://localhost:8000/semantic_layer/tables/?sl_id=0`; 
      return this.http.get(serviceUrl);
      console.log(this.slid);

    } 
    getSldetails(userid: string){
      const serviceUrl = `http://localhost:8000/semantic_layer/semantic_layers_details/?user_id=${userid}`; 
      return this.http.get(serviceUrl);
      console.log(this.userid);

    } 

      getUser() {
      const serviceUrl = 'localhost:8000/roles_and_responsibilities/';
      return this.http.get(serviceUrl);
      console.log(this.userid);
      
    }
    
    // } 
     
}


