import { Injectable } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { catchError, map } from 'rxjs/operators';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { json } from 'd3';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubmitRequestService {

  constructor(public djangoService: DjangoService,
   public ngToaster: NgToasterComponent) {
   }

   public lookUpTableData = [] ;

   public emitReqOnBehalfEmail = new Subject();
   public onBehalfEmail = "";
   public onBehalfUser = "";

  //  public loadingStatus = new Subject();

   public loadingStatus = new Subject<any>();
  //  public subLoadingStatus = this.loadingStatus.asObservable();
   public requestStatusEmitter = new Subject();

  getHttpLookUpTableData(){
    return this.djangoService.getLookupValues().pipe(map((res:any) => {
      this.lookUpTableData = res.data;
      return res;
    }),catchError(this.handleError.bind(this)));
  }

  getLookUpTableData(){
    return this.lookUpTableData
  }

  submitUserMarketSelection(req){
    return this.djangoService.ddm_rmp_report_market_selection(req).pipe(map((res:any) => {
      return res;
    }),catchError(this.handleError.bind(this)));
  }


  submitVehicelEventStatus(req){
    return this.djangoService.ddm_rmp_order_to_sales_post(req).pipe(map((res:any) => {
      return res;
    }),catchError(this.handleError.bind(this)));
  }

  submitDealerAllocation(req){
    return this.djangoService.ddm_rmp_dealer_allocation_post(req).pipe(map((res:any) => {
      return res;
    }),catchError(this.handleError.bind(this)));
  }

  getReportDescription(report_id){
    return this.djangoService.get_report_description(report_id).pipe(map((res:any) => {
      return res;
    }),catchError(this.handleError.bind(this)));
  }

  setSubmitOnBehalf(user,mail){
    if(mail)
      this.emitReqOnBehalfEmail.next(mail)
    this.onBehalfEmail = mail;
    this.onBehalfUser = user;
  }

  getSubmitOnBehalf(){
    return this.onBehalfUser
  }

  updateLoadingStatus(res){
    this.loadingStatus.next(res)
  }

  updateRequestStatus(res){
    this.requestStatusEmitter.next(res)
  }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: typeof error.error == "object"? JSON.stringify(error.error):error.error
    };
    this.ngToaster.error(errObj.message)
    throw errObj;
  }
}
