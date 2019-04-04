import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
// import { catchError } from "rxjs/operators";

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
  // public fetchCondition(){
  //   const serviceUrl = `${environment.baseUrl}reports/ddmCondition/?table_name=CDC_VEH_EDD_EXTRACTS`; 
  //   return this.http.get(serviceUrl); 
  // } 

  public fetchCondition(selected){
    const serviceUrl = `${environment.baseUrl}reports/ddmCondition/?table_name=${selected}`; 
    return this.http.get(serviceUrl); 
  } 

  public delCondition(conditionId) {
    const deleteUrl = `${environment.baseUrl}reports/ddmCondition/?condition_id=${conditionId}`;
    return this.http.delete(deleteUrl)
      .pipe(catchError(this.handleError));
  }
}

