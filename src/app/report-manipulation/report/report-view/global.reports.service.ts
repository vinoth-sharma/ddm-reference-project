import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthenticationService } from "../../../authentication.service";
import { get_report_list } from './report.apis';

@Injectable({
    providedIn: 'root'
})
export class GlobalReportServices {

    private ids = {
        user_id: 'LYC59J',
        sl_id: 1,
        report_id: null
    }
    public reportName :string = '';

    constructor(private _http: HttpClient,
        private authService: AuthenticationService) { }

    private reportList: Array<any> = [];

    getSlUserId() {
        this.authService.errorMethod$.subscribe(res => {
            // console.log(res);
            this.setUserId(res);
        })
    }

    setUserId(id) {
        this.ids.user_id = id;
    }

    setReportId(id) {
        this.ids.report_id = id;
    }

    setSLId(id) {
        this.ids.sl_id = id;
    }

    getSelectedIds() {
        return this.ids
    }

    getReportListHttp() {
        console.log(this.ids);

        let serviceUrl = `${get_report_list}?user_id=${this.ids.user_id}&sl_id=${this.ids.sl_id}`;
        return this._http.get(serviceUrl).pipe(map(
            (res: any) => {
                // console.log(res);
                this.reportName = res.data.report_list.filter(repo=>repo.report_id === this.ids.report_id)[0].report_name;
                this.reportList = res.data.report_list;
                return res.data.report_list
            }
        ), catchError(this.handleError));
    }

    getReportList() {
        return this.reportList;
    }

    updateReportList() {
        return this.getReportListHttp();
    }

    public handleError(error: any): any {
        let errObj: any = {
            status: error.status,
            message: error.error
        };
        throw errObj;
    }


}  