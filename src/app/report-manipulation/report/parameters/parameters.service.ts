import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  constructor(private http: HttpClient) { }
  
  public paramTables = new Subject<any[]>();
  public $paramTables = this.paramTables.asObservable();

   public setParamTables(tables: any) {
    this.paramTables.next(tables);
  }

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

  public getParameters(reportId: number) {
    let serviceUrl = `${environment.baseUrl}reports/create_parameter/?report_list_id=${reportId}`;

    return this.http.get(serviceUrl)
      .pipe(catchError(this.handleError));
  }

  public createHierarchy(data: any){
    let serviceUrl = `${environment.baseUrl}reports/parameters_hierarchy/`;

    return this.http.post(serviceUrl,data)
      .pipe(catchError(this.handleError));
  }

  public deleteParameter(data: any){
    let serviceUrl = `${environment.baseUrl}reports/delete_parameters/`;

    return this.http.post(serviceUrl,data)
      .pipe(catchError(this.handleError));
  }
}
