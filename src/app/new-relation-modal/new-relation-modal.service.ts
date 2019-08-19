import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewRelationModalService {

  constructor(private http:HttpClient) { }

  public handleError(error:any):any{
    let errObj:any = {
      status:error.status
    };

    throw errObj;
  }

  // public getTableInfo(sls){

  //   let serviceUrl = environment.baseUrl + "semantic_layer/tables/?sl_id="+sls;

  //   return this.http.get(serviceUrl)
  //   .pipe(
  //     catchError(this.handleError)
  //   );
    
  // };

  public saveTableRelationsInfo(options){

    let serviceUrl = environment.baseUrl + "semantic_layer/create_relationship/";

    let requestBody = new FormData();
    requestBody.append('join_type',options.join_type);
    requestBody.append('left_table_id' , options.left_table_id);
    requestBody.append('right_table_id' , options.right_table_id);
    requestBody.append('primary_key' , options.primary_key);
    requestBody.append('foreign_key' , options.foreign_key);

    return this.http.post(serviceUrl, requestBody)
    .pipe(
      catchError(this.handleError)
    );  
    
  };


  createRelations(option:any) {
    let serviceUrl = environment.baseUrl + "semantic_layer/create_relationship/";

    return this.http.post(serviceUrl, option)
    .pipe(
      catchError(this.handleError)
    );  
  }

  getRelations(slId) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/create_relationship/?sl_id=${slId}`;

    return this.http.get(serviceUrl)
    .pipe(
      catchError(this.handleError)
    );  
  }

  deleteRelations(rId) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/manage_relationship/?relationship_table_id=${rId}`;

    return this.http.delete(serviceUrl)
    .pipe(
      catchError(this.handleError)
    );
  }
}
