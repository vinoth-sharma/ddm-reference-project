import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { environment } from "../environments/environment";

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
public isButton : boolean;
public slid;
public slDetails;
public routeValue: boolean;
myMethod$: Observable<any>; 
Method$: Observable<any>; 
errorMethod$: Observable<any>;
button$: Observable<any>;
sl$: Observable<any>;
slRoute$: Observable<any>;
public userId: any= {};
private myMethodSubject = new BehaviorSubject<any>("");
public isButtonSubject = new BehaviorSubject<any>(this.isButton);
public slMethodSubject = new BehaviorSubject<any>(this.userid);
public slNamesMethodSubject = new BehaviorSubject<any>(this.slDetails);
public slRouteValueSubject = new BehaviorSubject<any>(this.routeValue);
private isUserLoggedIn;
constructor(private http:HttpClient) {
    this.isUserLoggedIn = false;
    this.myMethod$ = this.myMethodSubject.asObservable();
    this.Method$ = this.slMethodSubject.asObservable();
    this.button$ = this.isButtonSubject.asObservable();
    this.errorMethod$ = this.errorMethodSubject.asObservable();
    this.sl$ = this.slNamesMethodSubject.asObservable();
    this.slRoute$ = this.slRouteValueSubject.asObservable();
  }
  private errorMethodSubject = new BehaviorSubject<any>("") 
  myMethod(userInformation, userid){
    //console.log(userInformation);
    this.myMethodSubject.next(userInformation);
    this.slMethodSubject.next(userid);
  
  }
  setSlMethod(slDetails) {
    this.slNamesMethodSubject.next(slDetails);
  }
  setSlRoute(routeValue) {
    this.slRouteValueSubject.next(routeValue);
  }
  button(isButton) {
    this.isButtonSubject.next(isButton);
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
      const serviceUrl = `${environment.baseUrl}login/?userid=${userid}`; 
      return this.http.get(serviceUrl);

    }; 
    getTables(slid: number){
      const serviceUrl = `${environment.baseUrl}semantic_layer/tables/?sl_id=0`; 
      return this.http.get(serviceUrl); 
    } 
    getSldetails(userid: string){
      const serviceUrl = `${environment.baseUrl}semantic_layer/semantic_layers_details/?user_id=${userid}`; 
      return this.http.get(serviceUrl);
    } 

    getUser() {
      const serviceUrl = `${environment.baseUrl}roles_and_responsibilities/`;
      return this.http.get(serviceUrl);
      
    }

    logout() {

      const serviceUrl = `${environment.baseUrl}login/signout`;

      return this.http.get(serviceUrl);
    }
     
}


