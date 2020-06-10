import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public userid;
  public isButton: boolean;
  public slDetails;
  public routeValue: boolean;
  schema: string;
  private isUserLoggedIn;

  myMethod$: Observable<any>;
  Method$: Observable<any>;
  errorMethod$: Observable<any>;
  private myMethodSubject = new BehaviorSubject<any>("");
  public isButtonSubject = new BehaviorSubject<any>(this.isButton);
  public slMethodSubject = new BehaviorSubject<any>(this.userid);
  public slNamesMethodSubject = new BehaviorSubject<any>(this.slDetails);
  public slRouteValueSubject = new BehaviorSubject<any>(this.routeValue);

  private errorMethodSubject = new BehaviorSubject<any>("")

  constructor(private http: HttpClient) {
    this.isUserLoggedIn = false;
    this.myMethod$ = this.myMethodSubject.asObservable();
    this.Method$ = this.slMethodSubject.asObservable();
    this.errorMethod$ = this.errorMethodSubject.asObservable();
  }

  public myMethod(userInformation, userid, schema) {
    this.myMethodSubject.next(userInformation);
    this.slMethodSubject.next(userid);
    this.setSchema(schema);
  }

  public setSchema(schema) {
    this.schema = schema;
  }

  public button(isButton) {
    this.isButtonSubject.next(isButton);
  }
  public errorMethod(userInformation) {
    this.errorMethodSubject.next(userInformation);
  }
  public SetUserDetails() {
    this.isUserLoggedIn = true;
  }

  public getUserDetails() {
    return this.isUserLoggedIn;
  };

  public getHelpRedirection(value: string) {
    const serviceUrl = `${environment.baseUrl}login/help?help_section=${value}`;
    return this.http.get(serviceUrl, { responseType: 'blob' })
  }

  public getListUrl() {
    let urls = [
                "user/main/home",
                "user/main/ddm",
                "user/main/user-profile",
                "user/main/reference-documents",
                "user/main/ddm-admin",
                "user/submit-request",
                "user/submit-request/select-report-criteria",
                "user/submit-request/order-to-sale",
                "user/request-status",
                "user/reports",
                "user/metrics",
                "user/disclaimer"
              ];
    return urls;
  }

}