import { Component, OnInit,Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as $ from "jquery";
import { AuthenticationService } from '../authentication.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { ScheduleService } from './schedule.service';
import { MultiDatesService } from '../multi-dates-picker/multi-dates.service'
import Utils from 'src/utils';
import { ToastrService } from 'ngx-toastr';
import { scheduled } from 'rxjs';
// import { format } from 'path';


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
  public userId:any ={};
  public showRadio:boolean = true;
  public showNotification:boolean = true;
  // public todayDate:NgbDateStruct;
  // @Input() report_list_id : number;
  @Input() reportId: number;
  @Input() reportName: string;


  // @Input() reportId : number;
  @Input() scheduleReportData: any = {};
  @Output() update = new EventEmitter();
  public reportFormats = [
    {'value': 1, 'display': 'Csv'},
    {'value': 2, 'display': 'Excel'},
    {'value': 3, 'display': 'Pdf'},
  ];

  public sharingModes = [
    {'value': 1, 'display': 'Email'},
    // {'value': 2, 'display': 'Shared Drive'},
    {'value': 2, 'display': 'FTP'}
  ]

  public recurrencePattern = [
    {'value': 1, 'display': 'Every day'},
    {'value': 2, 'display': 'Every week'},
    {'value': 3, 'display': 'Every month'},
    {'value': 4, 'display': 'Every year'},
    {'value': 5, 'display': 'Custom'}
  ]

  public emails = [
    { 'display': 'siddharth.gupta@gm.com'},
    { 'display': 'himal.mangla@gm.com'},
    { 'display': 'aneesha.biju@gm.com'},
    { 'display': 'giridhar.dinakaran@gm.com'}
  ]

  public dls = [
    { 'value': 'grp-usssm.3.cadillac.-.reg.sales.mgr.-.all@gm.com', 'display': 'USSSM_3_CADILLAC-REGSALESMGR-ALL'},
    { 'value': 'grp-USSSM_FLD_DIST_MANAGER_SALES_DM_COMBINED@gm.com', 'display': 'USSSM_FLDDISTMANAGERSALES&DMCOMBINED'},
    { 'value': 'grp-USSSM_REG_MARKETING_MGR_ALL@gm.com', 'display': 'USSSM_REGMARKETINGMGR-ALL'},
    { 'value': 'grp-USSSM_ZONE_MANAGERS_ALL@gm.com', 'display': 'USSSM_ZONEMANAGERS-ALL'}
  ]

  public ftpAddresses = [
    { 'display': 'FTP_Link1'},
    { 'display': 'FTP_Link2'},
    { 'display': 'FTP_Link3'}
  ]

  public ftpPorts = [
    {'value': 1, 'display': 'Port1'},
    {'value': 2, 'display': 'Port2'},
    {'value': 3, 'display': 'Port3'}
  ]

  public scheduleData = {
    sl_id:'',
  created_by:'',
  report_list_id:'',
  report_name:'',
  schedule_for_date:'',
  schedule_for_time:'',
  custom_dates:[],
  recurring_flag:'',
  recurrence_pattern:'',
  export_format:'',
  notification_flag:'',
  sharing_mode:'',
  multiple_addresses:[],
  dl_list_flag:'',
  ftp_port:'',
  ftp_folder_path:'',
  ftp_user_name:'',
  ftp_password:'',
  modified_by:''
};

  constructor(public scheduleService: ScheduleService,
              public multiDatesService: MultiDatesService,
              public toasterService: ToastrService,
              private router: Router,
              public authenticationService: AuthenticationService) { }


  ngOnInit() {

    this.isEmailHidden = true;
    this.isSharedHidden = true;
    this.isFtpHidden = true;
    

    // console.log("SCHEDULE DATA BEING PRESET FOR EDIT",this.scheduleReportData);
    if('report_list_id' in this.scheduleReportData){
      this.scheduleData = this.scheduleReportData;
    }
    this.calendarHide = true;

    // console.log("SCHEDULED reccurring report value:",this.scheduleData.recurring_flag)
    if(this.scheduleData.recurring_flag === ""){
    // console.log("EMPTY VALUE FOR THE this.scheduleData.recurring_flag ")
      this.showRadio = false;
    }
    
    // console.log("SCHEDULED notfifcation value:",this.scheduleData.notification_flag)
    if(this.scheduleData.notification_flag === ""){
    // console.log("EMPTY VALUE FOR THE this.scheduleData.notification_flag ")
      this.showNotification = false;
    }
    
  }

  ngOnChanges(changes:SimpleChanges){
    if('reportId' in changes){
    this.scheduleData['report_list_id'] = changes.reportId.currentValue; }
    if('scheduleReportData' in changes) {
      this.scheduleData = this.scheduleReportData;
      // console.log("CHECKING scheduleData in ngOnChanges",this.scheduleData);
      this.changeDeliveryMethod(this.scheduleData.sharing_mode);
      
      if(this.scheduleData.schedule_for_date != null){
        const scheduledDate = new Date(this.scheduleData.schedule_for_date);
        this.datesSelected = [<NgbDateStruct>{
          month: scheduledDate.getMonth() + 1,
          year: scheduledDate.getFullYear(),
          day: scheduledDate.getDate()
        }];
        // let date = []
        // date.push(this.scheduleData.schedule_for_date);
      }
      // else{
        else if(this.scheduleData.custom_dates){
        this.values = this.scheduleData.custom_dates.map(date => {
          const scheduledDate = new Date(date);
          return <NgbDateStruct>{
            month: scheduledDate.getMonth() + 1,
            year: scheduledDate.getFullYear(),
            day: scheduledDate.getDate()
          };
        });
        this.datesSelected = this.values;
      }
      this.values = this.datesSelected.map(date => `${date.month}/${date.day}/${date.year}`);
    }
    if(this.reportName){
      // console.log("EDITING NOW & setting the sc-rep-name:",this.reportName)
      this.scheduleData.report_name = this.reportName;
    }
  }

  public changeDeliveryMethod(deliveryMethod){
    this.isEmailHidden = true;
    this.isSharedHidden = true;
    this.isFtpHidden = true;
    if(deliveryMethod == 1){
      this.isEmailHidden = false;
    }

    else{
      this.isFtpHidden = false;
    }
  }

  public apply(){
    // if( this.scheduleData.report_name && (this.scheduleData.schedule_for_date || this.scheduleData.custom_dates.length)
    //     && this.scheduleData.schedule_for_time && this.scheduleData.recurring_flag && this.scheduleData.export_format
    //     && this.scheduleData.notification_flag && this.scheduleData.sharing_mode ){

    //     }
    // this.checkEmptyField();
    // ////////////
    Utils.showSpinner();
    this.authenticationService.errorMethod$.subscribe(userId => this.userId = userId);
    this.scheduleData.created_by = this.userId;
    this.scheduleData.modified_by = this.userId;
    //TO DO : checking received scheduleReportId to differentiate apply/edit option
    this.scheduleService.updateScheduleData(this.scheduleData).subscribe(res => {
      this.toasterService.success('Report scheduled successfully');
      Utils.hideSpinner();
      Utils.closeModals();
      this.update.emit('updated');
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
    // if(this.scheduleData.sharing_mode === '1')
    // {
    //   this.scheduleData.multiple_addresses = [...value];
    // }
    // else{
    //   let ftp_value: any = [];
    //   ftp_value.push(value)
    //   this.scheduleData.multiple_addresses = ftp_value;
    // }
  }

  public setCustomValue(){
    this.isCollapsed = !this.isCollapsed;
  }

  public schedulingDates;
  public setSendingDates(){
    this.schedulingDates = this.multiDatesService.sendingDates;

    // console.log("DATE BEING EVALUATED:",this.schedulingDates)
    // console.log("DATE BEING EVALUATED LENGTH:",this.schedulingDates.length)

    if(this.schedulingDates.length === 1){
      // console.log("SINGLE DATE SETUP");
      this.scheduleData.schedule_for_date = this.multiDatesService.sendingDates[0].toString();
    }
    else{
      // console.log("MULTIPLE DATES SETUP");
      this.scheduleData.custom_dates = this.multiDatesService.sendingDates;
      this.scheduleData.schedule_for_date = ""
    }

    if(this.schedulingDates.length == 1 && this.scheduleData.custom_dates.length ){
      // console.log("resetting MULTIPLE DATES prev step");
      this.scheduleData.custom_dates = []
    }
  }
  
  public setCollapse(recurrencePattern: string){
    // console.log("this.isCollapsed value",this.isCollapsed);
    
    if(recurrencePattern === "5"){
      // this.isCollapsed = !this.isCollapsed;
      this.toasterService.warning("Please select custom dates from the date selector now!");
      this.setSendingDates();
    }
    else{
      this.isCollapsed = true;
    }
  }

  

  // public checkEmpty(){

  // }

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

  public dateValue : string;
  public calendarHide : boolean;
  public values : any = [];

  datesSelected:NgbDateStruct[]=[]; 

  change(value:NgbDateStruct[]){
    // console.log('ngbdatestruct', value);
    if(value.length){
      this.datesSelected=value;
      this.dateValue = this.datesSelected[0].month + '/' + this.datesSelected[0].day + '/' + this.datesSelected[0].year;
      this.values = [];
      this.datesSelected.forEach(element => {
        if(element.month === undefined ){ return }
        this.values.push((element.month + '/' + element.day + '/' + element.year).toString());
      });
    }
    else{
      this.values = [];
    }
    this.multiDatesService.sendingDates = this.values;
    console.log("this.multiDatesService.sendingDates VALUES:",this.multiDatesService.sendingDates)
  }

  public hideCalendar(){
  // console.log("HIDECALENDAR CALLED!");
  this.calendarHide = !this.calendarHide;
  // console.log("this.calendarHide value",this.calendarHide);
  }

  public seeingDates(){
    console.log("LOGGED DATES:",this.values);
  }

  // public todayDateMethod(){
  //   let todayTime = new Date();
  //   console.log("TODAY's DATE:",todayTime);
  //   console.log("Formatted date BEFORE:",this.todayDate);    
  //   let month = Number(todayTime.getMonth()+1)
  //   let date =  Number(todayTime.getDate()+1)
  //   let year =  Number(todayTime.getFullYear())
  //   console.log("Today's date:",month,"/",date,"/",year)

  //   this.todayDate = <NgbDateStruct>{ day: todayTime.getDate(), month: todayTime.getMonth()+1, year: todayTime.getFullYear() }
  //   console.log("Formatted date:",this.todayDate);
  // }


  // public checkEmptyField(){
  //   if(){  

  //   }
  // }
}