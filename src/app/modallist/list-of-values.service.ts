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
    if (typeof options.tableId != "undefined" && typeof options.columnName != "undefined") {
      let serviceUrl = `${environment.baseUrl}semantic_layer/lov_data/?table_id=${options.tableId}&column_name=${options.columnName}`;
      return this.http.get(serviceUrl)
        .pipe(catchError(this.handleError));
    }
  };


  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }
}
