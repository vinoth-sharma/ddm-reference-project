import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { GlobalReportServices } from "./global.reports.service";
import { get_report_sheet_data, report_creation, uploadFile, deleteReportOrSheet, renameSheet, downloadReportFileApi, save_page_json_api, create_paramter_api, delete_parameter_api, get_pivot_table_data } from "./report.apis";
import { element } from '@angular/core/src/render3/instructions';
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ReportViewService {

  constructor(private _http: HttpClient,
    private globalService: GlobalReportServices,
    private toasterService: ToastrService) { }

  // sheetDetails:SheetDetail[] = [];

  tabs: tab[] = [];
  sheetDetailsUpdated = new Subject();

  //once parameters applied, refersh tables
  refreshTableDataAppliedParam = new Subject();
  loaderSubject = new Subject();

  public reportId = null;

  // integration work-----------------------
  sheetDetails = [];
  sheetDetailsFromReport = [];

  //to get all report data for clone sheets from other reports
  getReportListData() {
    return this.globalService.getReportList()
  }

  //get sheets from current Report for sheet selection - download report
  getSheetsFromReport() {

    let data = this.globalService.getReportList().filter(report => report.report_id === this.globalService.getSelectedIds().report_id)

    let sheetIds = data[0].sheet_ids;
    let sheetNames = data[0].sheet_names;
    let sheetLength = sheetIds.length;
    let sheetData = [];
    // console.log(sheetIds);
    // console.log(sheetNames);
    for (let sheetNo = 0; sheetNo < sheetLength; sheetNo++) {
      let obj = {
        sheetId: sheetIds[sheetNo],
        sheetName: sheetNames[sheetNo]
      }
      sheetData.push(obj)
    }
    return sheetData
  }

  //filter report id from all reports
  getReportSheetData(reportId) {
    // console.log(reportId);
    let data = this.globalService.getReportList().filter(report => report.report_id === reportId)
    this.generateSheetData(data[0]);
  }

  //report obj as input, generate sheetDetails
  generateSheetData(data) {
    // console.log(data);
    this.sheetDetails = [];
    let sheetIds = data.sheet_ids;
    let pagesJson = data.pages_json;
    let sheetNames = data.sheet_names;
    // let sheetJson = data.sheet_json;
    let sheetLength = sheetIds.length;
    for (let sheetNo = 0; sheetNo < sheetLength; sheetNo++) {

      this.sheetDetails.push(
        {
          sheetId: sheetIds[sheetNo],
          sheetName: sheetNames[sheetNo],
          pageJson: pagesJson[sheetNo],
          // sheetJson: sheetJson[sheetNo],
          tabs: this.tabsGenerator(sheetNames,sheetIds,pagesJson,sheetNo)
        }
      )
    }
    this.sheetDetailsUpdated.next(this.sheetDetails)
  }


  private tabsGenerator(names,ids,jsons,no){
    let l_tabs = []
      if(jsons[no].filter(tab=>tab.tab_type === 'table').length === 1)
      {
        l_tabs = [...jsons[no]]
      }
      else{
        l_tabs = [{
          tab_name: names[no],
          tab_type: 'table',
          tab_sub_type: 'table',
          uniqueId: ids[no],
          tab_title: '',
          data: {},
          isSelected: true
        }, ...jsons[no]]
      }
      return l_tabs
  }


  private req_params_sheet_table_data = {
    sl_id: null,
    report_id: null,
    sheet_id: null,
    page_no: 1,
    per_page_data: 10,
    ticks: 0,
    order_by: false,
    column: '',
    ascending: true
  }

  getReportDataFromHttp(column: string, sortOrder: string, index: number, pageSize: number, sheetData, ticks) {

    // let api = get_report_sheet_data;
    let ids = this.globalService.getSelectedIds()
    this.req_params_sheet_table_data.sl_id = ids.sl_id;
    this.req_params_sheet_table_data.report_id = ids.report_id;
    this.req_params_sheet_table_data.sheet_id = sheetData.sheetId;
    this.req_params_sheet_table_data.per_page_data = pageSize;
    this.req_params_sheet_table_data.page_no = index + 1;
    this.req_params_sheet_table_data.ticks = ticks;

    if (column) {
      this.req_params_sheet_table_data.order_by = true;
      this.req_params_sheet_table_data.column = column;
      this.req_params_sheet_table_data.ascending = sortOrder === 'asc' ? true : false;
    }

    let api = get_report_sheet_data + this.generateParams(this.req_params_sheet_table_data)
    // console.log(api);
    return this._http.get<any>(api)
      .pipe(
        map(res => {
          // console.log(res)
          return res
        }),
        catchError(this.handleError.bind(this)))
  }

  //this function genetrate query params from js obj
  generateParams(obj) {
    let keys = Object.keys(obj);
    let str = "?";
    for (let l_obj in obj) {
      let subStr = Array.isArray(obj[l_obj]) ? '[' + obj[l_obj] + ']' : obj[l_obj]
      if (keys[keys.length - 1] == l_obj) {
        str += l_obj + '=' + subStr
      }
      else {
        str += l_obj + '=' + subStr + '&'
      }
    }
    return str
  }

  cloneSheetsToCurrentReport(data) {
    let ids = this.globalService.getSelectedIds()
    // console.log(data);
    let obj = {
      report_id: data.report_id,
      sheet_ids: data.sheet_details.map(ele => ele.sheet_id)
    }
    let body = {
      case_id: 2,
      sl_id: ids.sl_id,
      copy_to: ids.report_id,
      copy_from: [obj],
      new_sheet_names: data.sheet_details
    }
    // console.log(body);
    return this._http.post(report_creation, body).pipe(
      map((res) => {
        // console.log(res)
        this.toasterService.success('Sheets cloned successfully')
        return this.updateReportListAfterUploadORClone(res).pipe(map(
          (finalRes => {
            return finalRes
          })
        ))
      }),
      catchError(this.handleError.bind(this))
    )

  }

  //upload external files/data into existing report into separate sheet
  uploadFiletoSheet(data) {
    // console.log(data);
    let ids = this.globalService.getSelectedIds()
    let formData = new FormData()
    formData.append('ecs_file_upload', data.file)
    formData.append('report_id', ids.report_id)
    formData.append('sheet_name', data.sheet_name)

    return this._http.post(uploadFile, formData).pipe(
      map(res => {
        // console.log(res)
        this.toasterService.success('File uploaded successfully')
        return this.updateReportListAfterUploadORClone(res).pipe(map(
          (finalRes => {
            return finalRes
          })
        ))
      }),
      catchError(this.handleError.bind(this))
    )

  }
  // after csv uploaded AND clone sheet, updating in current sheetdetails
  updateReportListAfterUploadORClone(response) {
    return this.globalService.updateReportList().pipe(map(res => {
      // console.log(res);
      if (response.created_sheets_info) {
        response.created_sheets_info.forEach(singleSheet => {
          this.searchObj(res, singleSheet.sheet_id)
        });
      }
      else
        this.searchObj(res, response.data.report_sheet_id)
      return response
    })
    )
  }

  searchObj(res, id) {
    let data = res.filter(report => report.report_id === this.globalService.getSelectedIds().report_id)
    let index = data[0].sheet_ids.indexOf(id)
    let obj = {
      id: data[0].sheet_ids[index],
      name: data[0].sheet_names[index],
      // sheet_json : data[0].sheet_json[index],
      page_json: data[0].pages_json[index]
    }
    this.sheetDetailsPush(obj)
  }

  sheetDetailsPush(obj) {
    // console.log(obj);
    this.sheetDetails.push(
      {
        sheetId: obj.id,
        sheetName: obj.name,
        pageJson: obj.page_json,
        // sheetJson: obj.sheet_json,
        tabs: this.tabsGenerator1(obj)
      }
    )
    this.sheetDetailsUpdated.next(this.sheetDetails)
  }

  private tabsGenerator1(obj){
    let l_tabs = [];
    if(obj.page_json.filter(tab=>tab.tab_type === 'table').length === 1){
      l_tabs = [...obj.page_json]
    }
    else{
      l_tabs = [{
        tab_name: obj.name,
        tab_type: 'table',
        tab_sub_type: 'table',
        uniqueId: obj.id,
        tab_title: '',
        data: {},
        isSelected: true
      }, ...obj.page_json]
    }

    return l_tabs
  }

  //delete sheets from report through api
  deleteSheetsFromReport(index, sheetName) {
    let api = deleteReportOrSheet;
    let sheet = this.sheetDetails.filter(ele => ele.sheetName === sheetName)
    let id = index === -1 ? sheet[0].sheetId : this.sheetDetails[index].sheetId;
    let obj = {
      report_id: this.globalService.getSelectedIds().report_id,
      sheet_ids: [id]
    }
    return this._http.delete(api + this.generateParams(obj)).pipe(
      map((res:any) => {
        console.log(res);
        this.deleteSheetFromSheetDetails(index, sheetName)

      }),
      catchError(this.handleError.bind(this))
    )
  }

  //delete sheet from service sheetdetails
  deleteSheetFromSheetDetails(index, sheetName) {

    // updating the report list from http
    this.globalService.updateReportList().subscribe(res => {
      if (index === -1)
        this.sheetDetails = this.sheetDetails.filter(ele => ele.sheetName !== sheetName)
      else
        this.sheetDetails.splice(index, 1);
      // console.log(this.sheetDetails);
      this.sheetDetailsUpdated.next(this.sheetDetails)
      this.toasterService.success('sheet deleted succesfully')
      this.loaderSubject.next(false);
    })

  }

  //rename sheet from api
  renameSheetFromReport(sheetName, new_name) {
    // console.log(sheetName);
    let sheet = this.sheetDetails.filter(ele => ele.sheetName === sheetName);
    let l_sheet_id = sheet[0].sheetId;
    let obj = {
      report_sheet_id: l_sheet_id,
      sheet_name: new_name

    }
    return this._http.put(renameSheet, obj).pipe(
      map(res => {
        // console.log(res);
        this.loaderSubject.next(false);
        this.toasterService.success('sheet renamed succesfully')
        this.renameSheetFromSheetDetails(l_sheet_id, new_name)
      }),
      catchError(this.handleError.bind(this))
    )

  }

  //rename sheet from service sheetdetails
  renameSheetFromSheetDetails(id, name) {

    // updating the report list from http after rename is done
    this.globalService.updateReportList().subscribe(res => {
      this.sheetDetails.forEach(sheet => {
        sheet.sheetName = sheet.sheetId === id ? name : sheet.sheetName;
      })
    });

    // console.log(this.sheetDetails);
  }

  //check repeated sheet name present in report
  checkSheetNameInReport(reportName) {
    return this.sheetDetails.some(sheet => {
      return sheet.tabs.some(tab => tab.tab_name === reportName)
    })
  }

  downloadReportFile(sheets, format) {
    // console.log(data);

    let obj = {
      report_id: this.globalService.getSelectedIds().report_id,
      file_type: format
    }
    if (sheets.length > 0)
      obj['sheet_ids'] = sheets

    return this._http.post(downloadReportFileApi, obj, {
      responseType: 'blob', observe: 'response'
    }).pipe(
      map((res: any) => {
        console.log(res);
        let cd = res.headers.get('Content-Type')
        // console.log(cd);
        this.loaderSubject.next(false);
        return { data: res.body, fileName: this.globalService.getSelectedIds().report_id + '.zip' }
      }),
      catchError(this.handleError.bind(this))
    )
  }

  //save pagejson
  savePageJson(sheetData) {
    // console.log(sheetData);
    // console.log(this.sheetDetails);
    let l_pages_json = this.sheetDetails.filter(sheet => sheet.sheetId === sheetData.sheetId)[0].tabs;
    // console.log(l_pages_json);

    let body = {
      report_id: this.globalService.getSelectedIds().report_id,
      sheet_id: sheetData.sheetId,
      pages_json: l_pages_json
    }
    return this._http.put(save_page_json_api, body).pipe(
      map(res => {
        // console.log(res);
        return res
      }),
      catchError(this.handleError.bind(this)))
  }

  //create parameter for sheet level
  createParameter(selectedObj, sheetData) {
    // console.log(selectedObj);

    let obj = {
      parameter_name: selectedObj.parameterName,
      report_id: this.globalService.getSelectedIds().report_id,
      sheet_id: sheetData.sheetId,
      column_used: selectedObj.columnName,
      parameter_formula: selectedObj.parameterValues,
      default_value_parameter: [selectedObj.defaultParamValue]
    }

    selectedObj.desc.trim() ? obj['description'] = selectedObj.desc.trim() : '';

    return this._http.post(create_paramter_api, obj).pipe(
      map(res => {
        // console.log(res);
        this.toasterService.success('parameter created successfully')
        return res
      }),
      catchError(this.handleError.bind(this)))

  }

  //update selected parameters
  updateParameter(list) {
    // console.log(list);

    let obj = {
      parameter_id: list.parameterId,
      parameter_name: list.parameterName,
      report_id: this.globalService.getSelectedIds().report_id,
      sheet_id: list.sheetId,
      column_used: list.columnUsed,
      parameter_formula: list.parameterValues,
      default_value_parameter: list.defaultValues,
      applied_flag: list.appliedFlag,
      applied_values: list.appliedValues
    }
    list.description.trim() ? obj['description'] = list.description.trim() : '';

    return this._http.put(create_paramter_api, obj).pipe(
      map(res => {
        // console.log(res);
        this.refreshTableDataAppliedParam.next(res);
        return res
      }),
      catchError(this.handleError.bind(this)))
  }

  //delete selected parameters
  deleteParameters(parameter) {
    // console.log(parameter);
    let obj = {
      parameters_id: [parameter.parameterId]
    }
    return this._http.post(delete_parameter_api, obj).pipe(
      map(res => {
        // console.log(res);
        return res
      }),
      catchError(this.handleError.bind(this)))
  }

  //get pivot table from http
  getPivotTableData(data, sheetDetail) {
    console.log(data);
    console.log(sheetDetail);

    let obj = {
      report_id: this.globalService.getSelectedIds().report_id,
      sheet_id: sheetDetail.sheetId,
      pivot_data: [{
        rows: data.data.rowField,
        ticks: 10,
        values: data.data.dataField.map(ele => ele.value),
        // columns : "",
        margin: false,
        agg_func: data.data.dataField.map(ele => ele.function)
      }]
    }

    data.data.column.length > 0 ? obj.pivot_data[0]['columns'] = data.data.column[0] : '';

    return this._http.post(get_pivot_table_data, obj ).pipe(
      map(res => {
        // console.log(res);
        return res
      }),
      catchError(this.handleError.bind(this)))

    return this._http.get('/assets/pivot.json')
  }

  //delete tab in sheet level
  deleteTabInTableSheet(tabId, sheetName) {
    this.sheetDetails.forEach(sheet => {
      if (sheet.sheetName === sheetName) {
        sheet.tabs = sheet.tabs.filter(tab => !(tab.uniqueId === tabId))
      }
    })
    // console.log(this.sheetDetails);
  }

  //add charts/pivots to sheet contains table
  addNewTabInTable(tab, sheetName) {
    this.sheetDetails.forEach(sheet => {
      sheet.sheetName === sheetName ? sheet.tabs.push(tab) : '';
    })
    console.log(this.sheetDetails);
    // this.sheetDetailsUpdated.next(this.sheetDetails)
  }

  // ----------------------------------- static ui ---------------------------------------------------

  setReportId(id) {
    this.reportId = id;
  }

  // getReportData(column: string, sortOrder: string, index: number, pageSize: number, sheetData) {

  //   return this.getReportDataFromHttp(column, sortOrder, index, pageSize, sheetData).pipe(
  //     map(ele => {
  //       console.log(ele)
  //       return ele
  //     })
  //   )
  // }

  //initially get Sheet details
  getSheetData() {
    this.sheetDetails.push({ name: 'Sheet 1', sheet_type: 'table_data', tabs: [{ name: 'Table', type: 'table', uniqueId: 'Table 1', data: '' }], data: [] })
    this.sheetDetailsUpdated.next(this.sheetDetails)
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
    
    this.toasterService.error(errObj.message?errObj.message.error:'error');
    this.loaderSubject.next(false)
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
