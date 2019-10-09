import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConstantService } from "../constant.service";
import { ToastrService } from "ngx-toastr";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ParametersService {


    dataLoading = new Subject();

    constructor(private http: HttpClient,
        private constantService: ConstantService,
        private injector: Injector,
        private toasterService: ToastrService) { }


    getExistingParameters(id){
        let url = `${environment.baseUrl}reports/manage_parameters/?sl_tables_id=${id}`;
        this.dataLoading.next(true);
        return this.http.get(url)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        this.dataLoading.next(false);
                        return res
                    }),
                    catchError(this.handleError)
                )
    }    


    //function to create parameters on table level
    createParameterForTable(data){
        let url = `${environment.baseUrl}reports/manage_parameters/`;
        this.dataLoading.next(true);
        return this.http.post(url,data)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        this.dataLoading.next(false);
                        return res
                    }),
                    catchError(this.handleError)
                )
    }        


    updateParameterForTable(data){
        let url = `${environment.baseUrl}reports/manage_parameters/`;
        this.dataLoading.next(true);
        return this.http.put(url,data)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        this.dataLoading.next(false);
                        return res
                    }),
                    catchError(this.handleError)
                )
    }

    deleteParameter(id){
        let url = `${environment.baseUrl}reports/manage_parameters/?condition_id=${id}`
        this.dataLoading.next(true);
        return this.http.delete(url)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        this.dataLoading.next(false)
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
        this.dataLoading.next(false)
        this.toasterService.error("error")
        // this.toasterService.error('me')
        // this.toasterService.error(errObj.message?errObj.message.error:'error');    
        // return errObj
        throw errObj;
    }

}