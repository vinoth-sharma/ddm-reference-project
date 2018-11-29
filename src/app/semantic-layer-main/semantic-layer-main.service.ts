import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SemanticLayerMainService {

  constructor(private http:HttpClient) { }

  public handleError(error:any):any{
    let errObj:any = {
      status:error.status
    };
 
    throw errObj;
  }

  public saveTableName(options){

    let serviceUrl = "http://localhost:8000/semantic_layer/table_rename/";


    let requestBody = new FormData();
    requestBody.append('table_id',options.table_id);
    requestBody.append('table_name',options.table_name);

    return this.http.post(serviceUrl, requestBody)
    .pipe(
      catchError(this.handleError)
    );  
    
  };

  public saveColumnName(options){

    let serviceUrl = "http://localhost:8000/semantic_layer/column_rename/";

    let requestBody = new FormData();
    requestBody.append('sl_id',options.sl_id);
    requestBody.append('old_column_name',options.old_column_name);
    requestBody.append('table_id',options.table_id);
    requestBody.append('new_column_name',options.new_column_name);

    return this.http.post(serviceUrl, requestBody)
    .pipe(
      catchError(this.handleError) 
    );  
    
  };
}
