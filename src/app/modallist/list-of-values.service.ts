import { Injectable } from '@angular/core';
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListOfValuesService {

  constructor(private http: HttpClient) { }
  private lovEditData: any = [];

  public createListOfValues(options) {
    let lovUrl = `${environment.baseUrl}semantic_layer/lov_data/`
    let requestBody = {
      'sl_id': options.sl_id,
      'table_id': options.table_id,
      'lov_name': options.lov_name,
      'column_name': options.column_name,
      'value_list': options.value_list
    }
    return this.http.post(lovUrl, requestBody)
      .pipe(
        catchError(this.handleError)
      )
  };
  
  public getLov(options) {
    console.log("options from add-conditions", options);
    if (options.tableId && options.columnName) {
      let serviceUrl = `${environment.baseUrl}semantic_layer/lov_data/?table_id=${options.tableId}&column_name=${options.columnName}`;
      return this.http.get(serviceUrl)
        .pipe(catchError(this.handleError));
    }
  };

  public delLov(id) {
    const deleteUrl = `${environment.baseUrl}semantic_layer/lov_data/?lov_id=${id}`;
    return this.http.delete(deleteUrl)
      .pipe(catchError(this.handleError));
  }

  public updateLov(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/lov_data/`;
    return this.http.put(serviceUrl, {
      "lov_id": options.lov_id,
      "sl_id": options.sl_id,
      "table_id": options.table_id,
      "lov_name": options.lov_name,
      "column_name": options.column_name,
      "value_list": options.value_list
    })
      .pipe(catchError(this.handleError));
  };

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }
}