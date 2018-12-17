import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SecurityModalService {
  constructor(private http: HttpClient) {}

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status
    };

    throw errObj;
  }

  public getAllUserandSemanticList() {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/security/`;

    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public getListByOption(options) {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/security/`;

    let requestBody = {
      user_id: options.user_id,
      sl_name: options.sl_name
    };

    return this.http
      .post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  public updateSelectedList(options) {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/security/`;

    let requestBody = {
      user_id: options.user_id,
      sl_name: options.sl_name
    };

    return this.http
      .put(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }
}
