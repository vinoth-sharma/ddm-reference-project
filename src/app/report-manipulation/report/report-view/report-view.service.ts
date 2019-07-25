import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable , of, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { GlobalReportServices } from "./global.reports.service";

@Injectable({
  providedIn: 'root'
})
export class ReportViewService {

  constructor(private _http: HttpClient,
              private globalService : GlobalReportServices) { }

  // sheetDetails:SheetDetail[] = [];

  tabs:tab[] = [];
  sheetDetailsUpdated = new Subject();

  public reportId = null;
  
  // integration work-----------------------
  sheetDetails = [];
  sheetDetailsFromReport = [];

  getReportSheetData(reportId){
    let data = this.globalService.getReportList().filter(report=>report.report_id === reportId)
    this.generateSheetData(data[0]);
  }

  generateSheetData(data){
    let sheetIds = data.sheet_ids;
    let pagesJson = data.pages_json;
    let sheetNames = data.sheet_names;
    let sheetJson = data.sheet_json;
    let sheetLength = sheetIds.length;
    for (let sheetNo = 0; sheetNo < sheetLength; sheetNo++) {
      console.log(sheetNo);
      this.sheetDetails.push(
        {
          sheetId : sheetIds[sheetNo],
          sheetName : sheetNames[sheetNo],
          pageJson : pagesJson[sheetNo],
          sheetJson : sheetJson[sheetNo]
        }
      )
    }
    this.sheetDetailsUpdated.next(this.sheetDetails)
  }





// ----------------------------------- static ui ---------------------------------------------------

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

  //initially get Sheet details
  getSheetData(){
    this.sheetDetails.push({ name:'Sheet 1',sheet_type :'table_data',tabs:[{name:'Table',type:'table',uniqueId:'Table 1',data:''}] ,data:[] })
    this.sheetDetailsUpdated.next(this.sheetDetails)
  }

  //add charts/pivots to sheet contains table
  addNewTabInTable(tab,sheetName){
    console.log(tab);
    console.log(sheetName);
    
    this.sheetDetails.forEach(sheet=>{
      sheet.name === sheetName?sheet.tabs.push(tab):'';
    })
    console.log(this.sheetDetails);
    // this.sheetDetailsUpdated.next(this.sheetDetails)
  }

  deleteTabInTableSheet(tabName,sheetName){
    this.sheetDetails.forEach(sheet=>{
      if(sheet.name === sheetName)
          sheet.tabs = sheet.tabs.filter(tab=>!(tab.uniqueId === tabName))
    })
    console.log(this.sheetDetails);
    
    
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
