import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SecurityModalService {
  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };

    throw errObj;
  }

  public getUserList(value:string) {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/get_users_ldap?search_str=${value}`
    // let serviceUrl = `https://ddm1.apps.pcfepg2wi.gm.com/roles_and_responsibilities/get_users_ldap?search_str=${value}`; //uncomment it before merging to develop

    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public getAllUserandSemanticList() {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/security/`;

    // let serviceUrl = `https://ddm1.apps.pcfepg2wi.gm.com/roles_and_responsibilities/security/`;    

    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public getListByOption(options) {
        let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/security/`;

    // let serviceUrl = `https://ddm1.apps.pcfepg2wi.gm.com/roles_and_responsibilities/security/`;
    

    let requestBody = {
      user_id: options.user_id,
      sl_name: options.sl_name
    };

    return this.http
      .post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  public getDate(date) {
    var day = date.getDate();
    var month = (date.getMonth() + 1);
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
  }

  public getLogData(num: number, date1, date2) {
    const startDate1 = this.getDate(date1);
    const endDate1 = this.getDate(date2);
    let serviceUrl = `${environment.baseUrl}log_entry/get_log_data?log_type=${num}&start_date=${startDate1}&end_date=${endDate1}`;
    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public updateSelectedList(options) {
    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/security/`;

    // let serviceUrl = `https://ddm1.apps.pcfepg2wi.gm.com/roles_and_responsibilities/security/`;

    let requestBody = {
      user_id: options.user_id,
      sl_name: options.sl_name,
      case_id: options.case_id
    };
    return this.http
      .put(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }


  public storeUserDetails(data) {

    let serviceUrl = `${environment.baseUrl}roles_and_responsibilities/add_user_to_table/`;

    // let serviceUrl = `https://ddm1.apps.pcfepg2wi.gm.com/roles_and_responsibilities/add_user_to_table/`;

    return this.http.post(serviceUrl,data).pipe(catchError(this.handleError));
  }

}
