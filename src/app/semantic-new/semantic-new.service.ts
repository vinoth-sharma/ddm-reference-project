import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SemanticNewService {
  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message:error.error
    };
  
    throw errObj;
  };

  constructor(private http: HttpClient) { }

  saveSldetails(slBody) {
    let serviceUrl = `${environment.baseUrl}semantic_layer/manage_semantic_layer/`;
    let body = { sl_name: slBody.postName, user_id: slBody.postUser, original_table_name_list: slBody.postTables }
    return this.http.post(serviceUrl, body).pipe(catchError(this.handleError));
  }

}
