import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: "root"
})

export class ObjectExplorerSidebarService {

  footmethod$: Observable<any>;
  viewMethod$: Observable<any>;
  errorMethod$: Observable<any>;
  constructor(private http: HttpClient) {
    this.footmethod$ = this.footmethodSubject.asObservable();
    this.viewMethod$ = this.viewMethodSubject.asObservable();
    this.errorMethod$ = this.viewMethodSubject.asObservable();
  }

  myMethod(userInformation) {
    this.footmethodSubject.next(userInformation);
  }

  viewMethod(userInformation) {
    this.viewMethodSubject.next(userInformation);
  }

  footmethod(userInformation) {
    this.footmethodSubject.next(userInformation);
  }

  errorMethod(userInformation) {
    this.errorMethodSubject.next(userInformation);
  }

  private footmethodSubject = new BehaviorSubject<any>("")
  private viewMethodSubject = new BehaviorSubject<any>("")
  private errorMethodSubject = new BehaviorSubject<any>("")

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }

  public saveTableName(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/table_rename/`;
    return this.http.post(serviceUrl, options)
      .pipe(catchError(this.handleError));
  }

  public listValues(options) {
    let viewUrl = `${environment.baseUrl}semantic_layer/get_list_of_values/?table_name=${options.tableId}&column_name=${options.columnName}`;

    return this.http.get(viewUrl)
      .pipe(catchError(this.handleError))
  };

  public colProperties(options) {
    
    let colUrl = `${environment.baseUrl}semantic_layer/column_properties/`
    let requestBody = new FormData();
    requestBody.append('table_id', options.tableId);
    requestBody.append('column_name', options.columnName);
    return this.http.post(colUrl,requestBody)
      .pipe(
        catchError(this.handleError)
      )
  };

  public ChangeView(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/view_to_admin/`;
    let requestBody = new FormData();
    requestBody.append('table_id', options.table_id);
    requestBody.append('view_to_admins', options.view);

    return this.http.post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  };

  public checkUnique(){
    let serviceUrl = `${environment.baseUrl}semantic_layer/update_semantic_layer/`;
    return this.http.get(serviceUrl)
      .pipe(catchError(this.handleError));
  };

  public updateSemanticName(options){
    let serviceUrl = `${environment.baseUrl}semantic_layer/update_semantic_layer/`;
    return this.http.put(serviceUrl,{
      "sl_id" : options.slId,
      "new_semantic_layer_name" : options.new_semantic_layer ,
      "old_semantic_layer_name" : options.old_semantic_layer
      
    })
      .pipe(catchError(this.handleError));
  };

  public saveColumnName(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/manage_tables/`;
    let requestBody = new FormData();
    requestBody.append("sl_id", options.sl_id);
    requestBody.append("old_column_name", options.old_column_name);
    requestBody.append("table_id", options.table_id);
    requestBody.append("new_column_name", options.new_column_name);

    return this.http.put(serviceUrl, options)
      .pipe(catchError(this.handleError));
  }

  public getReports(tableId: number) {
    let getReportsUrl = `${environment.baseUrl}semantic_layer/dependent_reports/?sl_tables_id=${tableId}`;

    return this.http.get(getReportsUrl)
      .pipe(catchError(this.handleError));
  }

  public deleteTables(selectedTables: any[]) {
    let deleteUrl = `${environment.baseUrl}semantic_layer/manage_semantic_layer/`;
    let data = {
      'sl_tables_id': selectedTables
    }

    return this.http.request('delete', deleteUrl, { body: data })
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