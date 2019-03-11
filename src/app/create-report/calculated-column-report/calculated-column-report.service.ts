import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CalculatedColumnReportService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };
    throw errObj;
  }

  public getParameterList(data) {

    let serviceUrl = `${environment.baseUrl}reports/parameter/`;

    return this.http.post(serviceUrl,data)
    .pipe(catchError(this.handleError));
  }
}
