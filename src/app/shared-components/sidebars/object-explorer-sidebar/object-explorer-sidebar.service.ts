import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: "root"
})

export class ObjectExplorerSidebarService {

  getCustomTables: Observable<any>;
  getTables: Observable<any>;
  getName: Observable<any>;
  getValue: Observable<any>;
  getSlList: Observable<any>;
  public data;
  private customTablesSubject = new BehaviorSubject<any>("");
  private tablesSubject = new BehaviorSubject<any>("");
  private nameSubject = new BehaviorSubject<any>("");
  private valueSubject = new BehaviorSubject<any>("");
  private slListSubject = new BehaviorSubject<any>([]);
  
  constructor(private http: HttpClient) {
    this.getCustomTables = this.customTablesSubject.asObservable();
    this.getTables = this.tablesSubject.asObservable();
    this.getName = this.nameSubject.asObservable();
    this.getValue = this.valueSubject.asObservable();
    this.getSlList = this.slListSubject.asObservable();
  }

  setTables(semanticList) {
    this.tablesSubject.next(semanticList);
  }

  setName(semanticName) {
    this.nameSubject.next(semanticName);
  }
  
  setSlList(semanticList) {
    this.slListSubject.next(semanticList);
  }

  setValue(semanticValue) {
    this.valueSubject.next(semanticValue);
  }

  setCustomTables(userInformation) {
    this.customTablesSubject.next(userInformation);
  }

  public customQuery = new Subject<any>();

  public $customQuery = this.customQuery.asObservable();

  setCustomQuery(val:boolean){
    this.customQuery.next(val);
  }

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

  public saveCustomTableName(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/manage_views/`;
    return this.http.put(serviceUrl, options)
      .pipe(catchError(this.handleError));
  }

  public listValues(options) {
    let viewUrl = `${environment.baseUrl}semantic_layer/get_list_of_values/?sl_id=${options.slId}&table_name=${options.tableId}&column_name=${options.columnName}`;

    return this.http.get(viewUrl)
      .pipe(catchError(this.handleError))
  };

  public colProperties(options) {

    let colUrl = `${environment.baseUrl}semantic_layer/column_properties/`
    let requestBody = new FormData();
    requestBody.append('table_id', options.tableId);
    requestBody.append('column_name', options.columnName);
    return this.http.post(colUrl, requestBody)
      .pipe(
        catchError(this.handleError)
      )
  };

  public updateView(options) {

    let serviceUrl = `${environment.baseUrl}semantic_layer/view_to_admin/`;

    let requestBody = {
      'visible_table_ids': options.visible_tables,
      'hidden_table_ids': options.hidden_tables
    }
    
    return this.http.post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  };

  public checkUnique() {
    let serviceUrl = `${environment.baseUrl}semantic_layer/update_semantic_layer/`;
    return this.http.get(serviceUrl)
      .pipe(catchError(this.handleError));
  };

  public updateSemanticName(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/update_semantic_layer/`;
    return this.http.put(serviceUrl, {
      "sl_id": options.slId,
      "new_semantic_layer_name": options.new_semantic_layer,
      "old_semantic_layer_name": options.old_semantic_layer

    })
      .pipe(catchError(this.handleError));
  };

  public saveColumnName(options) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/manage_tables/`;

    let requestBody = {
      "sl_id": options.sl_id,
      "old_column_name": options.old_column_name,
      "sl_tables_id": options.table_id,
      "new_column_name": options.new_column_name
    }
    return this.http.put(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  public getReports(tableId: number) {
    let getReportsUrl = `${environment.baseUrl}semantic_layer/dependent_reports/?sl_tables_id=${tableId}`;

    return this.http.get(getReportsUrl)
      .pipe(catchError(this.handleError));
  }

  public deleteTables(selectedTables: any) {
    let deleteUrl = `${environment.baseUrl}semantic_layer/manage_semantic_layer/`;
    let data = {
      'sl_tables_id': selectedTables
    }
    return this.http.request('delete', deleteUrl, { body: data })
      .pipe(catchError(this.handleError));
  }

  public deleteCustomTables(selectedTables: any) {
    let deleteUrl = `${environment.baseUrl}semantic_layer/manage_views/`;
    let data = {
      'custom_table_id': selectedTables
    }
    return this.http.request('delete', deleteUrl, { body: data })
      .pipe(catchError(this.handleError));
  }

  public getAllTables(id: number) {
    let getUrl = `${environment.baseUrl}semantic_layer/tables_add/?sl_id=${id}`;

    return this.http.get(getUrl)
      .pipe(catchError(this.handleError));
  }

  public addTables(data: any) {
    let addUrl = `${environment.baseUrl}semantic_layer/tables_add/`;

    return this.http.put(addUrl, data)
      .pipe(catchError(this.handleError));
  }

  public deleteSemanticLayer(data: any) {
    let deleteUrl = `${environment.baseUrl}semantic_layer/update_semantic_layer/`;

    return this.http.request('delete', deleteUrl, { body: data })
      .pipe(catchError(this.handleError));
  }

  public deleteColumn(column: any) {
    let deleteUrl = `${environment.baseUrl}semantic_layer/manage_tables/`;

    return this.http.request('delete', deleteUrl, { body: column })
      .pipe(catchError(this.handleError));
  }

  public addColumn(data: any) {
    let addUrl = `${environment.baseUrl}semantic_layer/calculated_column_custom_table/`;

    return this.http.post(addUrl, data)
      .pipe(catchError(this.handleError));
  }


}