import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root"
})

export class SemdetailsService {
  footmethod$: Observable<any>;
  public sls;
  myMethod$: Observable<any>;
  private myMethodSubject = new BehaviorSubject<any>("");

  constructor(private http: HttpClient) {
    this.myMethod$ = this.myMethodSubject.asObservable();
    this.footmethod$ = this.footmethodSubject.asObservable();
  }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status
    };

    throw errObj;
  }

  myMethod(userInformation) {
    this.myMethodSubject.next(userInformation);
    this.footmethodSubject.next(userInformation);
  }

  private footmethodSubject = new BehaviorSubject<any>("")

  fetchsem(sls: number) {
    const serviceurl = `${environment.baseUrl}semantic_layer/manage_tables/?sl_id=${sls}`;

    return this.http.get(serviceurl)
      .pipe(catchError(this.handleError));
  }

  getviews(sls: number) {
    const serviceurl = `${environment.baseUrl}semantic_layer/manage_views/?sl_id=${sls}`;

    return this.http.get(serviceurl)
      .pipe(catchError(this.handleError));
  }
}
