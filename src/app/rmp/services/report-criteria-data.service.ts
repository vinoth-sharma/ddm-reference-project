
import {of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';



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
     return observableOf(this.user_id)
   }
   
   getReportID():Observable<any>{
    return observableOf(this.reportID)
   }

}
