import { Injectable } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { catchError, map } from 'rxjs/operators';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubmitRequestService {

  constructor(public djangoService: DjangoService,
    public ngToaster: NgToasterComponent) {
  }

  public lookUpTableData = [];
  public emitReqOnBehalfEmail = new Subject();
  public onBehalfEmail = "";
  public onBehalfUser = "";
  public loadingStatus = new Subject<any>();
  public requestStatusEmitter = new Subject();

  public getHttpLookUpTableData() {
    return this.djangoService.getLookupValues().pipe(map((res: any) => {
      this.lookUpTableData = res.data;
      return res;
    }), catchError(this.handleError.bind(this)));
  }

  public getLookUpTableData() {
    return this.lookUpTableData
  }

  public submitUserMarketSelection(req) {
    return this.djangoService.ddm_rmp_report_market_selection(req).pipe(map((res: any) => {
      return res;
    }), catchError(this.handleError.bind(this)));
  }

  public submitVehicelEventStatus(req) {
    return this.djangoService.ddm_rmp_order_to_sales_post(req).pipe(map((res: any) => {
      return res;
    }), catchError(this.handleError.bind(this)));
  }

  public submitDealerAllocation(req) {
    return this.djangoService.ddm_rmp_dealer_allocation_post(req).pipe(map((res: any) => {
      return res;
    }), catchError(this.handleError.bind(this)));
  }

  public getReportDescription(report_id) {
    return this.djangoService.get_report_description(report_id).pipe(map((res: any) => {
      return res;
    }), catchError(this.handleError.bind(this)));
  }

  public setSubmitOnBehalf(user, mail) {
    if (mail)
      this.emitReqOnBehalfEmail.next(mail)
    this.onBehalfEmail = mail;
    this.onBehalfUser = user;
  }

  public getSubmitOnBehalf() {
    return this.onBehalfUser
  }

  public updateLoadingStatus(res) {
    this.loadingStatus.next(res)
  }

  public updateRequestStatus(res) {
    this.requestStatusEmitter.next(res)
  }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: typeof error.error == "object" ? JSON.stringify(error.error) : error.error
    };
    this.ngToaster.error(errObj.message)
    throw errObj;
  }
}
