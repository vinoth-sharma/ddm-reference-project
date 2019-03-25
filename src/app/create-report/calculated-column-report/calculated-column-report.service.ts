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

    return this.http.post(serviceUrl, data)
      .pipe(catchError(this.handleError));
  }

  public delCalculation(calculatedId) {
    const deleteUrl = `${environment.baseUrl}reports/calculated_fields/?option=table&calculated_field_id=${calculatedId}`;
    return this.http.delete(deleteUrl)
      .pipe(catchError(this.handleError));
  }

  public getCalculatedFields() {
    let serviceUrl = `${environment.baseUrl}reports/calculated_fields/?sl_table_id=1185&option=table`;
    return this.http.get(serviceUrl)
      .pipe(catchError(this.handleError));
  }
}


