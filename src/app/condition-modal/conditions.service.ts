import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConstantService } from "../constant.service";

@Injectable({
  providedIn: 'root'
})
export class ConditionsService {

  public conditionList = ["=", "!=", "<", ">", "<=", ">=", "<>", "BETWEEN", "LIKE", "NOT LIKE", "IN", "NOT BETWEEN", "NOT IN", "IS NULL", "IS NOT NULL"];


  constructor(private http: HttpClient,
              private constantService : ConstantService,
              private injector: Injector) 
              {}

    getAggregationList(){
        return this.constantService.getSqlFunctions('aggregations');
    }       

    getConditionList(){
        return this.conditionList;
    }


}