import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class QueryBuilderService {
  constructor(private http: HttpClient) {}

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };

    throw errObj;
  }

   /**
   * save custom sql 
   */
  public saveSqlStatement(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/custom_table_query/`;

    let requestBody = {
      sl_id: options.sl_id,
      custom_table_query: options.query,
      custom_table_name: options.table_name
    };

    return this.http
      .post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  /**
   * execute custom sql
   */
  public executeSqlStatement(options) {
    
    let serviceUrl = `${environment.baseUrl}semantic_layer/execute_custom_query/`;

    let requestBody = {
      sl_id: options.sl_id,
      custom_table_query: options.query
    };

    return this.http
      .put(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }
}
