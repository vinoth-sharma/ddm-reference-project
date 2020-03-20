import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  public ecsReuploadParameters = {};

  constructor(private http: HttpClient) { }

  // if error found while calling api throw an error
  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }


// to generate new reports
  public generateReport(data: any) {
    let url = `${environment.baseUrl}reports/generate_report/`;
    return this.http.post(url, data)
      .pipe(catchError(this.handleError));
  }

  //to add new sheet to existing report 
  public createSheetToExistingReport(data: any) {
    let url = `${environment.baseUrl}reports/report_creation/`;
    return this.http.post(url, data)
      .pipe(catchError(this.handleError));
  }

  // to upload the generated report to ecs server
  public uploadReport(data: any) {
    let url = `${environment.baseUrl}reports/ddm_report_upload/`;
    return this.http.post(url, data)
      .pipe(catchError(this.handleError));
  }

  public setFailedEcsUploadParameters(uploadParameters){
    this.ecsReuploadParameters = uploadParameters;
  }
}




// let a = { sl_id: 194
//           report_name: "ganesh"
//           created_by: "LYC59J"
//           modified_by: "LYC59J"
//           description: "dsfdshgdgh"
//           is_dqm: false
//           extract_flag: (2) [1, 2]
//           user_id: ["LYC59J"]
//           dl_list: ["dl_list_5"]
//           sl_tables_id: [2962]
//           sl_custom_tables_id: []
//           is_chart: true
//           query_used: "SELECT T_2962.ALLOC_GRP_CD  FROM VSMDDM.VEHICLE_INFO T_2962  WHERE  ROWNUM  <= 1000   GROUP BY T_2962.ALLOC_GRP_CD ORDER BY T_2962.DELVRY_TYPE_CD_6000 ASC"
//           color_hexcode: "ffffff"
//           columns_used: ["ALLOC_GRP_CD"]
//           condition_flag: false
//           conditions_data: []
//           calculate_column_flag: false
//           calculate_column_data: []
//           sheet_json: {selected_tables: Array(1), calculated_fields: Array(0), aggregations: {…}, having: "", orderBy: {…}, …}
//           is_new_report: true
//           report_list_id: 0
//           request_id: "3142"
//           sheet_id: 0
//           is_copy_paste: undefined
//           sheet_name: "Sheet_1"   
//         }