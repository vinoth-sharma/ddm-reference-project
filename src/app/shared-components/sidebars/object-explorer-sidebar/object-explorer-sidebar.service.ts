import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root"
})

export class ObjectExplorerSidebarService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status
    };

    throw errObj;
  }

  public saveTableName(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/table_rename/`;

    let requestBody = new FormData();
    requestBody.append("sl_id", options.sl_id);
    requestBody.append("table_id", options.table_id);
    requestBody.append("table_name", options.table_name);

    return this.http.post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  public saveColumnName(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/table_column_rename/`;

    let requestBody = new FormData();
    requestBody.append("sl_id", options.sl_id);
    requestBody.append("old_column_name", options.old_column_name);
    requestBody.append("table_id", options.table_id);
    requestBody.append("new_column_name", options.new_column_name);

    return this.http.post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  public getReports(tableId: number) {
    let getReportsUrl = `${environment.baseUrl}semantic_layer/dependent_reports/?sl_tables_id=${tableId}`;

    return this.http.get(getReportsUrl)
      .pipe(catchError(this.handleError));
  }

  public deleteTables(selectedTables: any[]) {
    let deleteUrl = `${environment.baseUrl}semantic_layer/table_remove/`;
    let data = {
      'sl_tables_id': selectedTables
    }
    return this.http.post(deleteUrl, data)
      .pipe(catchError(this.handleError));
  }

  public getAllTables(id: number) {
    let getUrl = `${environment.baseUrl}semantic_layer/tables_add/?sl_id=${id}`;

    return this.http.get(getUrl)
      .pipe(catchError(this.handleError));
  }

  public addTables(data) {
    let addUrl = `${environment.baseUrl}semantic_layer/tables_add/`;

    return this.http.put(addUrl, data)
      .pipe(catchError(this.handleError));
  }
}