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

  public updateScheduleData(scheduleData){
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
      // signature_html_contents:scheduleData.signature_html_contents,
      is_file_uploaded:scheduleData.is_file_uploaded || false,
      uploaded_file_name:scheduleData.uploaded_file_name || '',
      ecs_file_object_name:scheduleData.ecs_file_object_name,
      ecs_bucket_name:scheduleData.ecs_bucket_name
      // TEMP COMMENTING FOR LOCAL WORK
      // uploaded_file_name:"scheduleData.uploaded_file_name || ''",
      // ecs_file_object_name:"scheduleData.ecs_file_object_name",
      // ecs_bucket_name:"scheduleData.ecs_bucket_name",
    };

    if(this.requestBody['sharing_mode'] === 2){
      this.requestBody['ftp_port'] =  parseInt(scheduleData.ftp_port) || 0,
      this.requestBody['ftp_folder_path'] = scheduleData.ftp_folder_path || "N/A",
      this.requestBody['ftp_user_name'] =  scheduleData.ftp_user_name || "N/A",
      this.requestBody['ftp_password'] = scheduleData.ftp_password || "N/A",
      this.requestBody['ftp_address'] = scheduleData.ftp_address || "N/A"
    }

    if(this.requestBody['recurring_flag'] === false){
      this.requestBody['recurrence_pattern'] = 0;
    }

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
      this.requestBody['report_schedule_id'] = this.setScheduleReportId;
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

  public getScheduleReportData(scheduleReportId){
    let serviceUrl = `${environment.baseUrl}reports/report_scheduler?report_schedule_id=${scheduleReportId}`;
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

  public getRequestDetails(reportIdProcured:number){
    let serviceUrl = `${environment.baseUrl}reports/get_report_requests?report_list_id=${reportIdProcured}`;
    return this.http.get(serviceUrl);
  }


} 
