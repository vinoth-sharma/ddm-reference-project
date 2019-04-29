import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';


@Injectable({
  providedIn: 'root'
})
export class RepotCriteriaDataService {

  constructor() { }
   reportID=0;
   user_id=0;

   setUserId(id){
     this.user_id =id;
   }
  
   setReportID(id){
    this.reportID = id;
   }

   getUserId():Observable<any>{
     return Observable.of(this.user_id)
   }
   
   getReportID():Observable<any>{
    return Observable.of(this.reportID)
   }

}
