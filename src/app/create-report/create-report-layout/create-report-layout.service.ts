import { Injectable } from '@angular/core';
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CreateReportLayoutService {

  constructor(private http: HttpClient) { }


  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }

  public getAllForEdit(ids) {
    let url = `${environment.baseUrl}reports/get_report_edit_data?report_id=${ids.report}&sheet_id=${ids.sheet}`;
    return this.http.get(url)
      .pipe(catchError(this.handleError));
  }

  public getRequestDetails(id) {
    let url = `${environment.baseUrl}RMP/get_report_description/?report_id=${id}`;
    return this.http.get(url)
      .pipe(catchError(this.handleError));
  }
}


