import { Injectable } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { catchError, map } from 'rxjs/operators';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { json } from 'd3';


@Injectable({
  providedIn: 'root'
})
export class SubmitRequestService {

  constructor(public djangoService: DjangoService,
   public ngToaster: NgToasterComponent) {
    console.log("jkl");
    
   }
  public lookUpTableData = [] ;

  loadLookUpTableData(){
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

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: typeof error.error == "object"? JSON.stringify(error.error):error.error
    };
    this.ngToaster.error(errObj.message)
    throw errObj;
  }
}
