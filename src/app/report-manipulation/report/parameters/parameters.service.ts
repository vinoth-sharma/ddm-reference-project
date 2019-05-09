import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }
  
  public createParameter(data: any) {
    let serviceUrl = `${environment.baseUrl}reports/create_parameter/`;

    return this.http.post(serviceUrl,data)
      .pipe(catchError(this.handleError));

  }

  // public getParameters(reportId: number, sheetId: number) {
  public getParameters(reportId: number) {
    // let serviceUrl = `${environment.baseUrl}reports/create_parameter/?report_list_id=${reportId}&sheet_id=${sheetId}`;
    let serviceUrl = `${environment.baseUrl}reports/create_parameter/?report_list_id=${reportId}`;

    return this.http.get(serviceUrl)
      .pipe(catchError(this.handleError));

  }
}
