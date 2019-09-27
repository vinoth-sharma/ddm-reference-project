import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConstantService } from "../constant.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ConditionsService {

  public conditionList = ["=", "!=", "<", ">", "<=", ">=", "<>", "BETWEEN", "LIKE", "NOT LIKE", "IN", "NOT BETWEEN", "NOT IN", "IS NULL", "IS NOT NULL"];


  constructor(private http: HttpClient,
              private constantService : ConstantService,
              private injector: Injector,
              private toasterService: ToastrService) 
              {}

    getAggregationList(){
        return this.constantService.getSqlFunctions('aggregations');
    }       

    getConditionList(){
        return this.conditionList;
    }

    getExistingConditions(data){
        let url = `${environment.baseUrl}reports/manage_conditions/?sl_tables_id=${data.data.sl_tables_id}`

        return this.http.get(url)
                .pipe(
                    map((res:any)=>{
                        // this.toasterService.success(res.message);
                        return res
                    }),
                    catchError(this.handleError)
                )
    }

    deleteCondition(id){
        let url = `${environment.baseUrl}reports/manage_conditions/?condition_id=${id}`

        return this.http.delete(url)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        return res
                    }),
                    catchError(this.handleError)
                )
    }
    //validate the condition
    validateConditions(data){
        let url = `${environment.baseUrl}reports/validate_condition_query/`

        return this.http.post(url,data)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        return res
                    }),
                    catchError(this.handleError)
                )
    }

    //function to create conditions on table level
    createConditionForTable(data){
        let url = `${environment.baseUrl}reports/manage_conditions/`;

        return this.http.post(url,data)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        return res
                    }),
                    catchError(this.handleError)
                )
    }

    updateConditionForTable(data){
        let url = `${environment.baseUrl}reports/manage_conditions/`;

        return this.http.put(url,data)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        return res
                    }),
                    catchError(this.handleError)
                )
    }

    public handleError(error: any): any {
        let errObj: any = {
          status: error.status,
          message: error.error || {}
        };
        console.log(errObj);
        this.toasterService.error("error")
        // this.toasterService.error('me')
        // this.toasterService.error(errObj.message?errObj.message.error:'error');    
        // return errObj
        throw errObj;
      }
}