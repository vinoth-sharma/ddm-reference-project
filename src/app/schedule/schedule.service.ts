import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  // public scheduleReportId : number;

  constructor(private http:HttpClient) { }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };

    throw errObj;
  }

  public putScheduleData(scheduleData){
    console.log("putScheduleData() called in schedule.service.ts");

    let serviceUrl = `${environment.baseUrl}reports/report_scheduler/`;

    let requestBody = {
      report_list_id: scheduleData.reportListId,
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
      custom_dates: scheduleData.scheduleDateCustom,
      schedule_for_date: scheduleData.scheduleDate,
      ftp_port: parseInt(scheduleData.ftp_port) || 0
      
    };

    return this.http
      .post(serviceUrl, requestBody)
      .pipe(catchError(this.handleError));
  }

  public getScheduledReports(){
    let serviceUrl = `${environment.baseUrl}reports/get_scheduled_reports`;
    return this.http.get(serviceUrl);
  }

  public getScheduleReportData(scheduleReportId){
    let serviceUrl = `${environment.baseUrl}reports/report_scheduler?report_schedule_id=${scheduleReportId}`
    return this.http.get(serviceUrl);
  }
} 
