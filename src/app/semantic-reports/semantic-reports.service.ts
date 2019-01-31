import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SemanticReportsService {
  constructor(private http: HttpClient) {}

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };
    throw errObj;
  }

  public getReportList(id) {
    let serviceUrl = `${environment.baseUrl}reports/get_report_list/?sl_id=${id}`;

    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public deleteReportList(option) {
    let serviceUrl = `${environment.baseUrl}reports/delete_multiple_reports/`;

    let requestBody = { 
      report_list_ids: option.report_list_id
    }
    return this.http.post(serviceUrl,requestBody).pipe(catchError(this.handleError));
  }
}
