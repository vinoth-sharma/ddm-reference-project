import { Injectable } from '@angular/core';
// import { environment } from ".../environments/environment";
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

  fetchCondition(){
    const serviceUrl = `http://localhost:8000/reports/ddmCondition/?table_name=CDC_VEH_EDD_EXTRACTS`; 
    return this.http.get(serviceUrl); 
  } 

}
