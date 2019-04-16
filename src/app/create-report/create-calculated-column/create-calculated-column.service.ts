import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class CreateCalculatedColumnService {

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

  public deleteField(id) {
    const deleteUrl = `${environment.baseUrl}reports/calculated_fields/?option=table&calculated_field_id=${id}`;
    
    return this.http.delete(deleteUrl)
      .pipe(catchError(this.handleError));
  }

  public getCalculatedFields(ids) {
//1185
    // let serviceUrl = `${environment.baseUrl}reports/calculated_fields/?sl_table_id=${id}&option=${option}`;

    let serviceUrl = `${environment.baseUrl}reports/get_existing_calculated_fields/`;
// let ids = {table_ids: [1186,1185]}
    return this.http.post(serviceUrl,ids)
      .pipe(catchError(this.handleError));
  }
}
