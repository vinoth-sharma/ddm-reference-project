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

  public getReportList(id,pNum,userId) {
    let serviceUrl = `${environment.baseUrl}reports/get_report_list/?user_id=${userId}&sl_id=${id}&page_num=${pNum}`;

    return this.http.get(serviceUrl).pipe(catchError(this.handleError));
  }

  public deleteReportList(option) {
    let serviceUrl = `${environment.baseUrl}reports/delete_multiple_reports/`;

    let requestBody = { 
      report_list_ids: option.report_list_id
    }
    return this.http.post(serviceUrl,requestBody).pipe(catchError(this.handleError));
  }

  public updateReport(option) {
    let serviceUrl = `${environment.baseUrl}reports/report_description/`;
    let formdata = new FormData();
    formdata.append("report_list_id", option.report_list_id);
    formdata.append("description", option.description);
    return this.http.post(serviceUrl,formdata).pipe(catchError(this.handleError));
}

  public renameReport(option) {
    let serviceUrl = `${environment.baseUrl}reports/report_description/`;

    let requestBody = { 
      report_list_id: option.report_list_id,
      report_name: option.report_name
    }
    return this.http.put(serviceUrl,requestBody).pipe(catchError(this.handleError));

  }
}
