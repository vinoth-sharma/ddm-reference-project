import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Router } from '@angular/router';
import Utils from 'src/utils';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  public scheduleReportIdFlag : number;
  public setScheduleReportId : number;
  public pdfFlag: boolean = false;
  public requestBody:any = {};
  public onGoingFlag:boolean = false;


  constructor(private http:HttpClient,
              private router: Router,
              public toasterService:ToastrService) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };

    throw errObj;
  }

  public updateScheduleData(scheduleData,reportIdProcuredFromChanges?){
    // console.log("updateScheduleData() called in schedule.service.ts");
    // console.log("DATA BEING SET IS :",scheduleData);

    // if( scheduleData.report_name && (scheduleData.schedule_for_date.length || scheduleData.custom_dates.length)
    //     && scheduleData.schedule_for_time && scheduleData.recurring_flag && scheduleData.export_format
    //     && scheduleData.notification_flag && scheduleData.sharing_mode ){
          // this.toasterService.error('Please enter valid values!');
          // //console.log("Stopping the scheduling!");
          // return;
        // }

    let serviceUrl = `${environment.baseUrl}reports/report_scheduler/`;

    this.requestBody = {
      sl_id: scheduleData.sl_id,
      // request_id:scheduleData.request_id[0]|| scheduleData.request_id,
      created_by: scheduleData.created_by || "",
      report_list_id: scheduleData.report_list_id,
      report_name: scheduleData.report_name,
      recurring_flag: scheduleData.recurring_flag,
      sharing_mode: parseInt(scheduleData.sharing_mode),
      export_format: parseInt(scheduleData.export_format),
      schedule_for_time: scheduleData.schedule_for_time, 
      notification_flag: scheduleData.notification_flag,
      dl_list_flag: false, //tbd
      multiple_addresses: scheduleData.multiple_addresses,
      user_list:  ['a','b','c','d'],
      recurrence_pattern: parseInt(scheduleData.recurrence_pattern) || 0,
      custom_range: 10,
      custom_dates: scheduleData.custom_dates || [],
      schedule_for_date: scheduleData.schedule_for_date || "01/01/2011",
      modified_by: scheduleData.created_by || "",
      dl_list: [],
      description:scheduleData.description,
      signature_html:scheduleData.signature_html,
      is_file_uploaded:scheduleData.is_file_uploaded || false,
    };

    // if(scheduleData.request_id && scheduleData.request_id == '' ){
    //   // DO Nothing,send no request-id
    //   // this.requestBody['request_id'] = scheduleData.request_id;
    // }

    if(scheduleData.request_id){
      this.requestBody['request_id'] = scheduleData.request_id;
    }

    if(scheduleData.request_id && scheduleData.request_id[0]){
      this.requestBody['request_id'] = scheduleData.request_id[0];
    }

    if(scheduleData.is_Dqm === 'true'){
      delete this.requestBody['request_id'];
    }
    
    if(this.requestBody['sharing_mode'] === 2){
      this.requestBody['ftp_port'] =  parseInt(scheduleData.ftp_port) || 0,
      this.requestBody['ftp_folder_path'] = scheduleData.ftp_folder_path || "N/A",
      this.requestBody['ftp_user_name'] =  scheduleData.ftp_user_name || "N/A",
      this.requestBody['ftp_password'] = scheduleData.ftp_pd || "N/A",
      this.requestBody['ftp_address'] = scheduleData.ftp_address || "N/A"
    }

    if(this.requestBody['recurring_flag'] === false){
      this.requestBody['recurrence_pattern'] = 0;
    }

    if(scheduleData.is_file_uploaded === true || scheduleData.is_file_uploaded != ""){
      this.requestBody['uploaded_file_name'] = scheduleData.uploaded_file_name; // append the respectie scheduleData later
      this.requestBody['ecs_file_object_name'] = scheduleData.ecs_file_object_name;
      this.requestBody['ecs_bucket_name'] = scheduleData.ecs_bucket_name;
    }

    // if(reportIdProcuredFromChanges && reportIdProcuredFromChanges.length){
    //   this.requestBody['report_list_id'] = reportIdProcuredFromChanges;
    // }
    if(!this.scheduleReportIdFlag || this.scheduleReportIdFlag === null || this.scheduleReportIdFlag === undefined){
      this.requestBody['modified_by'] = "";
      // console.log("DATA BEING SET",this.requestBody);
      return this.http
        .post(serviceUrl, this.requestBody)
        .pipe(map(res => {
          // this.router.navigate(['../scheduled-reports']);
          return res;
        }) , catchError(this.handleError));
    }
    else{
      this.requestBody['created_by'] = "";
      // this.setScheduleReportId = this.requestBody[]
      if(this.onGoingFlag == false){ // doing this to avoid override of on-going reports schedule-id
        this.requestBody['report_schedule_id'] = this.setScheduleReportId;
      }
      else if(this.onGoingFlag == true){
        this.requestBody['report_schedule_id'] = scheduleData['report_schedule_id'];
      }
      // console.log("DATA BEING SET",this.requestBody);
      return this.http
        .put(serviceUrl, this.requestBody)
        .pipe(catchError(this.handleError));
    }
        // }
  // else{
  //    this.toasterService.error('Please enter valid values!');
  //    Utils.hideSpinner();
  //     //console.log("Stopping the scheduling!");
  //     return;
  // }
  }

  public getScheduledReports(semanticLayerId){
    let serviceUrl = `${environment.baseUrl}reports/get_scheduled_reports?sl_id=${semanticLayerId}`;
    // const serviceUrl = 'assets/temp_reports_status.json';
    return this.http.get(serviceUrl);
  }

  public getScheduleReportData(scheduleReportId,onGoingFlag?:number){
    let serviceUrl;
    if(onGoingFlag == 1){
      serviceUrl = `${environment.baseUrl}reports/report_scheduler?request_id=${scheduleReportId}`;
      this.onGoingFlag = true;
    }
    else{
      serviceUrl = `${environment.baseUrl}reports/report_scheduler?report_schedule_id=${scheduleReportId}`;
    }
    this.setScheduleReportId = scheduleReportId
    return this.http.get(serviceUrl);
  }

  public uploadPdf(fileValues){
    let serviceUrl = `${environment.baseUrl}reports/upload_schedule_files/`;
    let fileData = new FormData();
    fileData.append('file_upload',fileValues['file_upload'])
    this.pdfFlag = true;
    return this.http
    .post(serviceUrl,fileData)
    .pipe(catchError(this.handleError));
  }

// OLD API to get emails
  public getRequestDetailsForScheduler(reportIdProcured:number){
    let serviceUrl = `${environment.baseUrl}reports/get_report_requests?report_list_id=${reportIdProcured}`;
    return this.http.get(serviceUrl);
  }


  // NEW API
  // public getRequestDetailsForScheduler(reportIdProcured){
  //   return this.http.get(`${environment.baseUrl}RMP/get_report_description/`, {
  //     params: {
  //       report_id: reportIdProcured,
  //     }
  //   }
  //   )
  // }

} 
