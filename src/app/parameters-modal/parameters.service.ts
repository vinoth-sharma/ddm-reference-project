import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConstantService } from "../constant.service";
// import { ToastrService } from "ngx-toastr";
import { NgToasterComponent } from "../custom-directives/ng-toaster/ng-toaster.component";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ParametersService {


    dataLoading = new Subject();
    createORupdateTriggered = new Subject();

    constructor(private http: HttpClient,
        private constantService: ConstantService,
        private injector: Injector,
        private toasterService: NgToasterComponent) { }


    getExistingParametersTables(id){
        let url = `${environment.baseUrl}reports/manage_parameters/?sl_tables_id=${id}`;
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

    getExistingParametersCustomTables(id){
        let url = `${environment.baseUrl}reports/manage_parameters/?custom_table_id=${id}`;
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

    //function to create parameters on table level
    createParameterForTable(data){
        let url = `${environment.baseUrl}reports/manage_parameters/`;
        this.dataLoading.next(true);
        return this.http.post(url,data)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        this.dataLoading.next(false);
                        this.createORupdateTriggered.next(true);
                        return res
                    }),
                    catchError(this.handleError.bind(this))
                )
    }        


    updateParameterForTable(data){
        let url = `${environment.baseUrl}reports/manage_parameters/`;
        // this.dataLoading.next(true);
        return this.http.put(url,data)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        // this.dataLoading.next(false);
                        this.createORupdateTriggered.next(true);
                        return res
                    }),
                    catchError(this.handleError.bind(this))
                )
    }

    deleteParameter(id){
        let url = `${environment.baseUrl}reports/manage_parameters/?sl_parameters_id=${id}`
        // this.dataLoading.next(true);
        return this.http.delete(url)
                .pipe(
                    map((res:any)=>{
                        this.toasterService.success(res.message);
                        // this.dataLoading.next(false)
                        this.createORupdateTriggered.next(true);
                        return res
                    }),
                    catchError(this.handleError.bind(this))
                )
    }

    public handleError(error: any): any {
        let errObj: any = {
            status: error.status,
            message: error.error || {}
        };
        console.log(errObj);
        this.dataLoading.next(false)
        this.toasterService.error(errObj.message?errObj.message.error:'error');    
        // return errObj
        throw errObj;
    }

}