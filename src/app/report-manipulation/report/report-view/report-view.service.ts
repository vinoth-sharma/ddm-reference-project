import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { GlobalReportServices } from "./global.reports.service";
import { get_report_sheet_data } from "./report.apis";

@Injectable({
  providedIn: 'root'
})
export class ReportViewService {

  constructor(private _http: HttpClient,
    private globalService: GlobalReportServices) { }

  // sheetDetails:SheetDetail[] = [];

  tabs: tab[] = [];
  sheetDetailsUpdated = new Subject();

  public reportId = null;

  // integration work-----------------------
  sheetDetails = [];
  sheetDetailsFromReport = [];

  getReportSheetData(reportId) {
    let data = this.globalService.getReportList().filter(report => report.report_id === reportId)
    this.generateSheetData(data[0]);
  }

  generateSheetData(data) {
    console.log(data);

    let sheetIds = data.sheet_ids;
    let pagesJson = data.pages_json;
    let sheetNames = data.sheet_names;
    let sheetJson = data.sheet_json;
    let sheetLength = sheetIds.length;
    for (let sheetNo = 0; sheetNo < sheetLength; sheetNo++) {
      console.log(sheetNo);
      this.sheetDetails.push(
        {
          sheetId: sheetIds[sheetNo],
          sheetName: sheetNames[sheetNo],
          pageJson: pagesJson[sheetNo],
          sheetJson: sheetJson[sheetNo],
          tabs: [{
            name: sheetNames[sheetNo],
            type: 'table',
            uniqueId: sheetIds[sheetNo],
            data: '',
            isSelected: true
          }]
        }
      )
    }
    this.sheetDetailsUpdated.next(this.sheetDetails)
  }





  private req_params_sheet_table_data = {
    sl_id: null,
    report_id: null,
    sheet_id: null,
    page_no: 1,
    per_page_data: 10,
    ticks: 1,
    order_by: false,
    column: '',
    ascending: true
  }

  getReportDataFromHttp(column: string, sortOrder: string, index: number, pageSize: number, sheetData) {
    // const reportApi = `${environment.baseUrl}reports/report_charts/?report_list_id=${reportId}`;
    console.log(sheetData);
    console.log(index);
    console.log(sortOrder);
    console.log(column);
    

    // let api = get_report_sheet_data;
    let ids = this.globalService.getSelectedIds()
    this.req_params_sheet_table_data.sl_id = ids.sl_id;
    this.req_params_sheet_table_data.report_id = ids.report_id;
    this.req_params_sheet_table_data.sheet_id = sheetData.sheetId;
    this.req_params_sheet_table_data.per_page_data = pageSize;
    this.req_params_sheet_table_data.page_no = index+1;
   
    if(column){
      this.req_params_sheet_table_data.order_by = true;
      this.req_params_sheet_table_data.column = column;
      this.req_params_sheet_table_data.ascending = sortOrder === 'asc'?true:false;
    }
    console.log(this.req_params_sheet_table_data);
    let api = get_report_sheet_data + this.generateParams(this.req_params_sheet_table_data)
    console.log(api);
    
    return this._http.get<any>(api)
      .pipe(
        map(res => {
          console.log(res)
          return res.data
        }),
        catchError(this.handleError))
    return this._http.get<any>('/assets/sample.json');
  }

  generateParams(obj) {
    let keys = Object.keys(obj);
    let str = "?";
    for (let l_obj in obj) {
      if (keys[keys.length - 1] == l_obj)
        str += l_obj + '=' + obj[l_obj];
      else
        str += l_obj + '=' + obj[l_obj] + '&'
    }
    console.log(str);
    console.log(get_report_sheet_data + str);

    return str
  }

  // ----------------------------------- static ui ---------------------------------------------------

  setReportId(id) {
    this.reportId = id;
  }

  getReportData(column: string, sortOrder: string, index: number, pageSize: number, sheetData) {

    return this.getReportDataFromHttp(column, sortOrder, index, pageSize, sheetData).pipe(
      map(ele => {
        console.log(ele)
        return ele
      })
    )
  }

  //initially get Sheet details
  getSheetData() {
    this.sheetDetails.push({ name: 'Sheet 1', sheet_type: 'table_data', tabs: [{ name: 'Table', type: 'table', uniqueId: 'Table 1', data: '' }], data: [] })
    this.sheetDetailsUpdated.next(this.sheetDetails)
  }

  //add charts/pivots to sheet contains table
  addNewTabInTable(tab, sheetName) {
    console.log(tab);
    console.log(sheetName);

    this.sheetDetails.forEach(sheet => {
      sheet.name === sheetName ? sheet.tabs.push(tab) : '';
    })
    console.log(this.sheetDetails);
    // this.sheetDetailsUpdated.next(this.sheetDetails)
  }

  deleteTabInTableSheet(tabName, sheetName) {
    this.sheetDetails.forEach(sheet => {
      if (sheet.name === sheetName)
        sheet.tabs = sheet.tabs.filter(tab => !(tab.uniqueId === tabName))
    })
    console.log(this.sheetDetails);


  }



  addNewSheet(name: string, sheetType: string, dataParams) {
    if (name.trim() === '')
      name = "Sheet " + (this.sheetDetails.length + 1);
    // this.sheetDetails.push({ name: name,sheet_type :sheetType ,data_type:dataParams.type,data: dataParams})
    this.sheetDetailsUpdated.next(this.sheetDetails)
  }

  deleteExistingSheet(index: number, sheetName: string) {
    if (index === -1)
      this.sheetDetails = this.sheetDetails.filter(ele => ele.name !== sheetName)
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
  name: string;
  sheet_type: string;
  data;
  tabs: Array<any>;
}
export interface tab {
  uniqueId: string;
  name: string;
  type: string;
  data;
}
