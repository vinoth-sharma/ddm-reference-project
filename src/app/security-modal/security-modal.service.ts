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
      status: error.status,
      message: error.error
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

  public getLogData(num : number,date1, date2) {
    // const startDate = new Date(this.date.value).toLocaleDateString();
    // const endDate = new Date(this.defaultEndDate.value).toLocaleDateString();
    const startDate = new Date(date1).toLocaleString();
    const startDate1 = startDate.substring(0,10);
    const endDate = new Date(date2).toLocaleString();
    const endDate1 = endDate.substring(0,10);
    let serviceUrl = `${environment.baseUrl}log_entry/get_log_data?log_type=${num}&start_date=${startDate1}&end_date=${endDate1}`; 
    // let serviceUrl = `${environment.baseUrl}log_entry/get_log_data?log_type=${num}&start_date=${date1}&end_date=${date2}`; 
    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public updateSelectedList(options) {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/security/`;

    let requestBody = {
      user_id: options.user_id,
      sl_name: options.sl_name,
      case_id: options.case_id
    };
    return this.http
      .put(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }
}
