import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public userid;
  public isButton: boolean;
  public slid;
  public slDetails;
  public routeValue: boolean;
  schema: string;

  myMethod$: Observable<any>;
  Method$: Observable<any>;
  errorMethod$: Observable<any>;
  button$: Observable<any>;
  sl$: Observable<any>;
  slRoute$: Observable<any>;
  public userId: any = {};
  private myMethodSubject = new BehaviorSubject<any>("");
  public isButtonSubject = new BehaviorSubject<any>(this.isButton);
  public slMethodSubject = new BehaviorSubject<any>(this.userid);
  public slNamesMethodSubject = new BehaviorSubject<any>(this.slDetails);
  public slRouteValueSubject = new BehaviorSubject<any>(this.routeValue);
  private isUserLoggedIn;
  constructor(private http: HttpClient) {
    this.isUserLoggedIn = false;
    this.myMethod$ = this.myMethodSubject.asObservable();
    this.Method$ = this.slMethodSubject.asObservable();
    this.button$ = this.isButtonSubject.asObservable();
    this.errorMethod$ = this.errorMethodSubject.asObservable();
    this.sl$ = this.slNamesMethodSubject.asObservable();
    this.slRoute$ = this.slRouteValueSubject.asObservable();
  }
  private errorMethodSubject = new BehaviorSubject<any>("")
  myMethod(userInformation, userid, schema) {
    this.myMethodSubject.next(userInformation);
    this.slMethodSubject.next(userid);
    this.setSchema(schema);
  }


  setSchema(schema) {
    this.schema = schema;
  }

  getSchema() {
    return this.schema;
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

  getHelpRedirection(value: string) {
    const serviceUrl = `${environment.baseUrl}login/help?help_section=${value}`;
    return this.http.get(serviceUrl, { responseType: 'blob' })
  }

}


