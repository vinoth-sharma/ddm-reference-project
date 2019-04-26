import { Component, OnInit,Input, SimpleChanges } from '@angular/core';
import * as $ from "jquery";

import { ScheduleService } from './schedule.service';
import { MultiDatesService } from '../multi-dates-picker/multi-dates.service'
import Utils from 'src/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  public isCollapsed = true;
  public isSharedHidden : boolean;
  public isFtpHidden : boolean;
  public isEmailHidden : boolean;
  public deliveryMethod: any;

  // @Input() report_list_id : number;

  @Input() reportId : number;
  @Input() scheduleReportData: any = {};
  public reportFormats = [
    {'value': 1, 'display': 'Csv'},
    {'value': 2, 'display': 'Excel'},
    {'value': 3, 'display': 'Pdf'},
    {'value': 4, 'display': 'Text'},
    {'value': 5, 'display': 'HTML'},
    {'value': 6, 'display': 'XML'}
  ];

  public sharingModes = [
    {'value': 1, 'display': 'Email'},
    {'value': 2, 'display': 'Shared Drive'},
    {'value': 3, 'display': 'FTP'},
  ]

  public scheduleData = { reportListId:'',report_name:'',scheduleDate:'',schedule_for_time:'',recurring_flag:'',recurrence_pattern:'',scheduleDateCustom:['06/02/2019','09/09/2019'],export_format:'',notification_flag:'',sharing_mode:'',multiple_addresses:[],dl_list_flag:false,ftp_port:''};

  constructor(public scheduleService: ScheduleService,public multiDatesService: MultiDatesService, private toasterService: ToastrService) { }


  ngOnInit() {
    this.isEmailHidden = true;
    this.isSharedHidden = true;
    this.isFtpHidden = true;
    // console.log("SCHEDULE DATA BEING PRESET FOR EDIT",this.scheduleReportData);
    if('report_list_id' in this.scheduleReportData){
      this.scheduleData = this.scheduleReportData;
    }
  }

  ngOnChanges(changes:SimpleChanges){
    if('reportId' in changes){
    this.scheduleData['reportListId'] = changes.reportId.currentValue; }
    if('scheduleReportData' in changes) {
      this.scheduleData = this.scheduleReportData;
      // console.log('New data', this.scheduleData);
    }
  }

  public changeDeliveryMethod(deliveryMethod : number){
    this.isEmailHidden = true;
    this.isSharedHidden = true;
    this.isFtpHidden = true;
    if(deliveryMethod == 1){
      this.isEmailHidden = false;
    }
    else if(deliveryMethod == 2){
      this.isSharedHidden = false;
    }
    else{
      this.isFtpHidden = false;
    }
  }

  public apply(){
    Utils.showSpinner();
    this.scheduleService.putScheduleData(this.scheduleData).subscribe(res => {
      this.toasterService.success('Report scheduled successfully');
      Utils.hideSpinner();
      Utils.closeModals();
    }, error => {
      Utils.hideSpinner();
      this.toasterService.error('Report schedule failed');
    });
  }

  public setNotificationValue(value:string){
    this.scheduleData.notification_flag = value;
  }

  public setRecurringFlag(value:string){
    this.scheduleData.recurring_flag = value;
  }

  public setListValues(value:string){
    this.scheduleData.multiple_addresses = [...value];
  }

  public setCustomValue(){
    this.isCollapsed = !this.isCollapsed;
  }

  public setSendingDates(){
    this.scheduleData.scheduleDate = this.multiDatesService.sendingDates.toString();
  }
  
}