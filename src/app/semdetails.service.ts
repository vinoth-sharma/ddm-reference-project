import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
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

  myMethod(userInformation) {
    this.myMethodSubject.next(userInformation);
    this.footmethodSubject.next(userInformation);
  }
  private footmethodSubject = new BehaviorSubject<any>("")
  fetchsem(sls: number) {
    const serviceurl = `${environment.baseUrl}semantic_layer/tables/?sl_id=${sls}`;
    return this.http.get(serviceurl);
  }
}
