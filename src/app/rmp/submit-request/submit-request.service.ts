import { Injectable } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { catchError, map } from 'rxjs/operators';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { json } from 'd3';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubmitRequestService {

  constructor(public djangoService: DjangoService,
   public ngToaster: NgToasterComponent) {
   }

   public lookUpTableData = [] ;
   public requestOnBehalf:any = {} ;
   public emitReqOnBehalfEmail = new Subject();


   public onBehalfEmail = ""
   public onBehalfUser = ""

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

  setSubmitOnBehalf(user,mail){
    if(mail)
      this.emitReqOnBehalfEmail.next(mail)
    this.onBehalfEmail = user;
    this.onBehalfUser = mail;
  }

  getSubmitOnBehalf(){
    return this.onBehalfUser
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
