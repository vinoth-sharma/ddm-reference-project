import { Injectable } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubmitRequestService {

  constructor(public djangoService: DjangoService) {
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


  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };
    
    throw errObj;
  }
}
