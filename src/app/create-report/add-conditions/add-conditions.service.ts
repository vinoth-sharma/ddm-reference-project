import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AddConditionsService {

  constructor(private http: HttpClient) {}

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status
    };

    throw errObj;
  }

  public fetchCondition(options) {
    console.log("selected",options)
    const serviceUrl = `${environment.baseUrl}reports/get_existing_conditions/`; 
    let requestBody = {
      'table_list': options.table_list
    }
    return this.http.post(serviceUrl,requestBody); 
  } 
  
  public delCondition(conditionId) {
    const deleteUrl = `${environment.baseUrl}reports/ddmCondition/?condition_id=${conditionId}`;
    return this.http.delete(deleteUrl)
      .pipe(catchError(this.handleError));
  }
}

