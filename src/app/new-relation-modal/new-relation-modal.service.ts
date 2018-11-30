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

  public getTableInfo(sls){

    let serviceUrl = environment.baseUrl + "semantic_layer/tables/?sl_id="+sls;

    return this.http.get(serviceUrl)
    .pipe(
      catchError(this.handleError)
    );
    
  };

  public saveTableRelationsInfo(options){

    let serviceUrl = environment.baseUrl + "semantic_layer/create_relationship/";


    let requestBody = new FormData();
    requestBody.append('join_type',options.join_type);
    requestBody.append('left_table_id' , options.left_table_id);
    requestBody.append('right_table_id' , options.right_table_id);
    requestBody.append('primary_key' , options.primary_key);
    requestBody.append('foreign_key' , options.foreign_key);
    // requestBody.append('right_table_id','233');
    // requestBody.append('left_table_id' , '169');
    // requestBody.append('primary_key' , 'ALLOC_GRP_CD');
    // requestBody.append('foreign_key' , 'SHIP_BUS_AST_CD');
    // requestBody.append('join_type' , 'outer');
    // console.log(serviceUrl,'serviceUrl'); 
    return this.http.post(serviceUrl, requestBody)
    .pipe(
      catchError(this.handleError)
    );  
    
  };
}
