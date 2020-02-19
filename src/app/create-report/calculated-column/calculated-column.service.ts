import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Observable, of, Subject } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalculatedColumnService {
  constructor(private http: HttpClient,private toasterService: ToastrService) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };
    this.toasterService.error(errObj.message?errObj.message.error:'error');
    throw errObj;
  }


  // public getParameterList(data) {

  //   let serviceUrl = `${environment.baseUrl}reports/parameter/`;

  //   return this.http.post(serviceUrl, data)
  //     .pipe(catchError(this.handleError));
  // }

  public createCalculatedField(data){
    const createUrl = `${environment.baseUrl}reports/calculated_fields/`;
    let obj = {
      calculated_field_name : data.columnName,
      table_list : data.table_list , 
      column_used : data.column_used ,
      calculated_field_formula : data.formula,
      applied_flag : true,
      cal_field_json : data.table_aliases_used
    }
    return this.http.post(createUrl,obj).pipe(
      map(res => {
        // console.log(res);
        this.toasterService.success('Calculated column created successfully')
        return res
      }),
      catchError(this.handleError.bind(this)))
  }


  public updateCalculatedField(data){
    const createUrl = `${environment.baseUrl}reports/calculated_fields/`;
    let obj = {
      calculated_field_id : data.calculated_field_id,
      calculated_field_name : data.columnName,
      table_list : data.table_list , 
      column_used : data.column_used ,
      calculated_field_formula : data.formula,
      applied_flag : true,
      cal_field_json : data.table_aliases_used
    }
    return this.http.put(createUrl,obj).pipe(
      map(res => {
        // console.log(res);
        this.toasterService.success('Calculated column updated successfully')
        return res
      }),
      catchError(this.handleError.bind(this)))
  }

  public deleteCalcField(id) {
    const deleteUrl = `${environment.baseUrl}reports/calculated_fields/?option=table&calculated_field_id=${id}`;
    
    return this.http.delete(deleteUrl).pipe(
      map(res => {
        // console.log(res);
        this.toasterService.success('Calculated column deleted successfully')
        return res
      }),
      catchError(this.handleError.bind(this)))
  }

  public getCalculatedFields(ids) {
    let serviceUrl = `${environment.baseUrl}reports/get_existing_calculated_fields/`;
    return this.http.post(serviceUrl,ids)
      .pipe(catchError(this.handleError.bind(this)));
  }

}
