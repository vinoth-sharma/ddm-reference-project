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
  tabs:tab[] = [];
  sheetDetailsUpdated = new Subject();

  public reportId = null;
  
  getSheetData(){
    console.log('gh');
    
    this.sheetDetails.push({ name:'Sheet 1',sheet_type :'table_data',tabs:[{name:'Table',type:'table',data:''}] ,data:[] })
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
  addNewTabInTable(tab,sheetName){
    console.log(tab);
    console.log(sheetName);
    
    this.sheetDetails.forEach(sheet=>{
      sheet.name === sheetName?sheet.tabs.push(tab):'';
    })
    console.log(this.sheetDetails);
    this.sheetDetailsUpdated.next(this.sheetDetails)
    // this.sheetDetails.push({ name: sheet_name,sheet_type :'' ,tabs : [],data:[]})
  }

  addNewSheet(name:string,sheetType:string,dataParams){
    if(name.trim() === '')
      name = "Sheet "+ (this.sheetDetails.length + 1);
    // this.sheetDetails.push({ name: name,sheet_type :sheetType ,data_type:dataParams.type,data: dataParams})
    this.sheetDetailsUpdated.next(this.sheetDetails)
  }
  
  deleteExistingSheet(index:number,sheetName:string){
    if(index===-1)
      this.sheetDetails = this.sheetDetails.filter(ele=>ele.name !== sheetName)
    else
      this.sheetDetails.splice(index, 1);
    this.sheetDetailsUpdated.next(this.sheetDetails)
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
   sheet_type:string;
   data;
   tabs:Array<any>;
 }
 export interface tab{
   uniqueId:string;
   name:string;
   type:string;
   data;
 }