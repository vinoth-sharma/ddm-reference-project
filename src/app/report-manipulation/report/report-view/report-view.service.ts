import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable , of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportViewService {

  constructor(private _http: HttpClient) { }

  sheetDetails = []
  public reportId = null;

  getReportDataFromHttp(){
    // const reportApi = `${environment.baseUrl}reports/report_charts/?report_list_id=${reportId}`;
    
    return this._http.get<any>('/assets/sample.json');  
  }
  
  setReportId(id){
    this.reportId = id;
  }

  getReportData(){
    return this.getReportDataFromHttp().pipe(
      map(ele=>{
        // this.sheetDetails.push({ name:'sheet 1',type:'table_data',data:ele })
        console.log(ele)
        return ele
      })
    )
  }

  handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }
  
}
 export interface SheetDetail {
   name ;
   type;
   data;
 }