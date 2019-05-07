import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  public scheduleReportIdFlag : number;
  public setScheduleReportId : number;


  constructor(private http:HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };

    throw errObj;
  }

  public updateScheduleData(scheduleData){
    console.log("updateScheduleData() called in schedule.service.ts");
    console.log("DATA BEING SET IS :",scheduleData);

    let serviceUrl = `${environment.baseUrl}reports/report_scheduler/`;

    let requestBody = {
      sl_id: scheduleData.sl_id,
      created_by: scheduleData.created_by || "",
      report_list_id: scheduleData.report_list_id,
      report_name: scheduleData.report_name,
      recurring_flag: scheduleData.recurring_flag,
      sharing_mode: parseInt(scheduleData.sharing_mode),
      export_format: parseInt(scheduleData.export_format),
      schedule_for_time: scheduleData.schedule_for_time, 
      notification_flag: scheduleData.notification_flag,
      dl_list_flag: scheduleData.dl_list_flag != "", //tbd
      multiple_addresses: scheduleData.multiple_addresses,
      user_list:  ['a','b','c','d'],
      recurrence_pattern: parseInt(scheduleData.recurrence_pattern) || 0,
      custom_range: 10,
      custom_dates: scheduleData.custom_dates || [],
      schedule_for_date: scheduleData.schedule_for_date || "10/10/2010",
      ftp_port: parseInt(scheduleData.ftp_port) || 0,
      modified_by: scheduleData.created_by || ""
      
    };

    if(this.scheduleReportIdFlag == null){
      // requestBody['created_by'] = "";
      requestBody['modfied_by'] = "";
      return this.http
        .post(serviceUrl, requestBody)
        .pipe(catchError(this.handleError));
    }
    else{
      // requestBody['modfied_by'] = "";
      requestBody['created_by'] = "";
      requestBody['report_schedule_id'] = this.setScheduleReportId;
      return this.http
        .put(serviceUrl, requestBody)
        .pipe(catchError(this.handleError));
    }
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
} 
