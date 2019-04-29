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
  public isCollapsed: boolean = true;
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

  public recurrencePattern = [
    {'value': 1, 'display': 'Every day'},
    {'value': 2, 'display': 'Every week'},
    {'value': 3, 'display': 'Every month'},
    {'value': 4, 'display': 'Every year'},
    {'value': 5, 'display': 'Custom'},
  ]

  public emails = [
    { 'display': 'User1@gm.com'},
    { 'display': 'User2@gm.com'},
    { 'display': 'User3@gm.com'},
  ]

  public dls = [
    { 'display': 'DL1'},
    { 'display': 'DL2'},
    { 'display': 'DL3'},
  ]

  public sharedDrives = [
    { 'display': 'SD_Link1'},
    { 'display': 'SD_Link2'},
    { 'display': 'SD_Link3'},
  ]

  public ftpAddresses = [
    { 'display': 'FTP_Link1'},
    { 'display': 'FTP_Link2'},
    { 'display': 'FTP_Link3'},
  ]

  public ftpPorts = [
    {'value': 1, 'display': 'Port1'},
    {'value': 2, 'display': 'Port2'},
    {'value': 3, 'display': 'Port3'},
  ]

  public scheduleData = { report_list_id:'',report_name:'',schedule_for_date:'',schedule_for_time:'',custom_dates:[],recurring_flag:'',recurrence_pattern:'',export_format:'',notification_flag:'',sharing_mode:'',multiple_addresses:[],dl_list_flag:'',ftp_port:''};

  constructor(public scheduleService: ScheduleService,
              public multiDatesService: MultiDatesService,
              public toasterService: ToastrService) { }


  ngOnInit() {

    this.isEmailHidden = true;
    this.isSharedHidden = true;
    this.isFtpHidden = true;

    // console.log("SCHEDULE DATA BEING PRESET FOR EDIT",this.scheduleReportData);
    if('report_list_id' in this.scheduleReportData){
      this.scheduleData = this.scheduleReportData;
    }
    // Utils.showSpinner();
    // this.seggregateMultipleAddresses()
  }

  ngOnChanges(changes:SimpleChanges){
    if('reportId' in changes){
    this.scheduleData['report_list_id'] = changes.reportId.currentValue; }
    if('scheduleReportData' in changes) {
      this.scheduleData = this.scheduleReportData;
      console.log("CHECKING scheduleData in ngOnChanges",this.scheduleData);
      // if(this.scheduleData['export_format'] == "")
    }
  }

  public changeDeliveryMethod(deliveryMethod){
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

  public setNotificationValue(value){
    this.scheduleData.notification_flag = value;
  }

  public setRecurringFlag(value){
    this.scheduleData.recurring_flag = value;
  }

  public setListValues(value: any[]){
    this.scheduleData.multiple_addresses = [...value];
  }

  public setCustomValue(){
    this.isCollapsed = !this.isCollapsed;
  }

  public schedulingDates;
  public setSendingDates(){
    this.schedulingDates = this.multiDatesService.sendingDates;

    console.log("DATE BEING EVALUATED:",this.schedulingDates)
    console.log("DATE BEING EVALUATED LENGTH:",this.schedulingDates.length)

    if(this.schedulingDates.length === 1){
      console.log("SINGLE DATE SETUP");
      this.scheduleData.schedule_for_date = this.multiDatesService.sendingDates[0].toString();
    }
    else{
      console.log("MULTIPLE DATES SETUP");
      this.scheduleData.custom_dates = this.multiDatesService.sendingDates;
      this.scheduleData.schedule_for_date = ""
    }

    if(this.schedulingDates.length == 1 && this.scheduleData.custom_dates.length ){
      console.log("resetting MULTIPLE DATES prev step");
      this.scheduleData.custom_dates = []
    }
  }
  
  public setCollapse(recurrencePattern: string){
    console.log("this.isCollapsed value",this.isCollapsed);
    
    if(recurrencePattern === "5"){
      // this.isCollapsed = !this.isCollapsed;
      this.toasterService.warning("Please select custom dates from the date selector now!");
      this.setSendingDates();
    }
    else{
      this.isCollapsed = true;
    }
  }

  // public seggregateMultipleAddresses(){
  //   if(this.scheduleData.sharing_mode.length){
  //     if(this.scheduleData.sharing_mode === "Email"){
  //       this.isEmailHidden = false;
  //     }
  //     else if(this.scheduleData.sharing_mode === "Shared Drive"){
  //       this.isSharedHidden = false;
  //     }
  //     else{
  //       this.isFtpHidden = false;
  //     }
  //   }
  //   else{
  //     console.log("NOT CHECKING THE MultipleAddresses")
  //   }
  // }
}