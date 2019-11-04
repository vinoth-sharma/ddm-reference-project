import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { catchError, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AddConditionsService {

  constructor(private http: HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status
    };

    throw errObj;
  }

  public fetchCondition(data) {
    const serviceUrl = `${environment.baseUrl}reports/get_existing_conditions/`;
    let requestBody = {
      'table_list': data
    }
    return this.http.post(serviceUrl, requestBody);
  }

  public delCondition(conditionId) {
    const deleteUrl = `${environment.baseUrl}reports/ddmCondition/?condition_id=${conditionId}`;
    return this.http.delete(deleteUrl)
      .pipe(catchError(this.handleError));
  }

  public saveCondition(options) {
    let saveUrl = `${environment.baseUrl}reports/ddmCondition/`
    let object = {
      'condition_name': options.condition_name,
      'table_list': options.table_list,
      'column_used': options.column_used,
      'condition_formula': options.condition_formula,
      'applied_flag': true,
      'condition_json': options.condition_json
    }
    return this.http.post(saveUrl, object)
      .pipe(
        catchError(this.handleError)
      )
  };

    getExistingParametersTables(id,column){
    let url = `${environment.baseUrl}reports/manage_parameters/?sl_tables_id=${id}&column_used=${column}`;
    // this.dataLoading.next(true);
    return this.http.get(url)
            .pipe(
                map((res:any)=>{
                    // this.toasterService.success(res.message);
                    // this.dataLoading.next(false);
                    return res
                }),
                catchError(this.handleError.bind(this))
            )
}
}

