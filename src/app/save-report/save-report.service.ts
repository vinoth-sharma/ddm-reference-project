import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SaveReportService {

  constructor(private http: HttpClient) {}

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };

    throw errObj;
  }

    public getAllUsers() {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/get_users`;
    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public shareToLandingPage(options) {
    let serviceUrl = `${environment.baseUrl}reports/report_share/`;
    let requestBody = {
      user_id: options.user_id,
      report_list_id: options.report_list_id
    };
    return this.http
      .post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }
}
