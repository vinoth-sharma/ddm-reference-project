import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable , of, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportViewService {

  constructor(private _http: HttpClient) { }

  sheetDetails:SheetDetail[] = [];

  sheetDetailsUpdated = new Subject();

  public reportId = null;
  
  getSheetData(){
    console.log('gh');
    
    this.sheetDetails.push({ name:'Sheet 1',type:'table_data',data:[] })
    this.sheetDetailsUpdated.next(this.sheetDetails)
  }

  getReportDataFromHttp(column:string,sortOrder:string,index:number,pageSize:number){
    // const reportApi = `${environment.baseUrl}reports/report_charts/?report_list_id=${reportId}`;
    
    return this._http.get<any>('/assets/sample.json');  
  }
  
  setReportId(id){
    this.reportId = id;
  }

  getReportData(column:string,sortOrder:string,index:number,pageSize:number){

    return this.getReportDataFromHttp(column,sortOrder,index,pageSize).pipe(
      map(ele=>{
        console.log(ele)
        return ele
      })
    )
  }


  addNewSheet(name:string,type:string){

    this.sheetDetails.push({ name: name,type:type,data:[] })

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
   name:string;
   type:string;
   data:Array<any>;
 }