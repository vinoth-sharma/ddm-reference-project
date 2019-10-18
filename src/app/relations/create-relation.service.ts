import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreateRelationService {
  
  constructor(private http:HttpClient) { }

  public handleError(error:any):any{
    let errObj:any = {
      status:error.status
    };

    throw errObj;
  }

  createRelations(option:any, type:boolean) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/manage_relationship/`;

    if(!type){
      return this.http.post(serviceUrl, option)
    .pipe(
      catchError(this.handleError)
    );
  }else {
    return this.http.put(serviceUrl, option)
    .pipe(
      catchError(this.handleError)
    );
  }


  }

  getRelations(slId) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/manage_relationship/?sl_id=${slId}`;

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
