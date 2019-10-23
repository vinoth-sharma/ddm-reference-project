import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }

  public generateReport(data: any) {
    
    let url = `${environment.baseUrl}reports/generate_report/`;

    return this.http.post(url, data)
      .pipe(catchError(this.handleError));
  }

  public createSheetToExistingReport(data: any) {
    
    let url = `${environment.baseUrl}reports/report_creation/`;

    return this.http.post(url, data)
      .pipe(catchError(this.handleError));
  }

  public uploadReport(data: any) {
    
    let url = `${environment.baseUrl}reports/ddm_report_upload/`;

    return this.http.post(url, data)
      .pipe(catchError(this.handleError));
  }
}
