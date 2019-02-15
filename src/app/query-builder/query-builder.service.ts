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
  public saveSqlStatement(data) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/custom_table_query/`;

    let requestBody = {
      sl_id: data.sl_id,
      custom_table_query: data.query,
      custom_table_name: data.table_name
    };

    return this.http
      .post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  /**
   * execute custom sql
   */
  public executeSqlStatement(data) {
    
    let serviceUrl = `${environment.baseUrl}semantic_layer/execute_custom_query/`;

    return this.http
      .post(serviceUrl, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * editQueryName
   */
  public editQueryName(data) {
    let serviceurl = `${environment.baseUrl}semantic_layer/manage_views/`;

    return this.http.put(serviceurl,data)
      .pipe(catchError(this.handleError));
  }
}
