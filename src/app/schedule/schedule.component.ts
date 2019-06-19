import { Component, OnInit,Input, SimpleChanges, ElementRef, Output, EventEmitter ,ViewChild} from '@angular/core';
// import * as $ from "jquery";
import { AuthenticationService } from '../authentication.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { ScheduleService } from './schedule.service';
import { MultiDatesService } from '../multi-dates-picker/multi-dates.service'
import Utils from 'src/utils';
import { ToastrService } from 'ngx-toastr';
import { scheduled } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
declare var $: any;
import { ShareReportService } from '../share-reports/share-report.service';
import { CreateReportLayoutService } from '../create-report/create-report-layout/create-report-layout.service';
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
  minDate: NgbDateStruct;
  file: File;
  @ViewChild('pdf')
  pdfFile: ElementRef;
  fileName: string;
  public fileUpload: boolean = false;
  public signatureName: string;
  public signSelected: boolean = false;
  description: string;
  signatures = [];
  // selectSign: string;
  public selected_id: number;
  selectId;
  public editorData: '';
  maxSignId: number;
  signNames = [];
  defaultError = "There seems to be an error. Please try again later.";
  
  public dateValue : string;
  public calendarHide : boolean;
  public values : any = [];

  datesSelected:NgbDateStruct[]=[]; 

  
  // public todayDate:NgbDateStruct;
  // @Input() report_list_id : number;
  @Input() reportId: number;
  @Input() reportName: string;
  @Input() selectedReqId: number;
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
  ftp_address: '',
  ftp_user_name:'',
  ftp_password:'',
  modified_by:'',
  dl_list:[],
  description:'',
  signature_html:'',
  is_file_uploaded:false
};

  constructor(public scheduleService: ScheduleService,
              public multiDatesService: MultiDatesService,
              public toasterService: ToastrService,
              private router: Router,
              public authenticationService: AuthenticationService,
              private shareReportService: ShareReportService,
              private createReportLayoutService : CreateReportLayoutService) { }


  ngOnInit() {

    this.isEmailHidden = true;
    this.isSharedHidden = true;
    this.isFtpHidden = true;
    this.minDate = {year: new Date().getFullYear(), month : new Date().getMonth()+1, day: new Date().getDate()}
    

    // //console.log("SCHEDULE DATA BEING PRESET FOR EDIT",this.scheduleReportData);
    if('report_list_id' in this.scheduleReportData){
      this.scheduleData = this.scheduleReportData;
    }
    this.calendarHide = true;

    // //console.log("SCHEDULED reccurring report value:",this.scheduleData.recurring_flag)
    if(this.scheduleData.recurring_flag === ""){
    // //console.log("EMPTY VALUE FOR THE this.scheduleData.recurring_flag ")
      this.showRadio = false;
    }

    // console.log("SCHEDULED notfifcation value:",this.scheduleData.notification_flag)
    if(this.scheduleData.notification_flag === ""){
    // //console.log("EMPTY VALUE FOR THE this.scheduleData.notification_flag ")
      this.showNotification = false;
    }

    // this.fruitCtrl.valueChanges.pipe(
    //   debounceTime(500),
    //   map((value) => value)
    // ).subscribe(value => {
    //   if (this.isDuplicate && value !== '') {
    //     this.isDuplicate = false;
    //   }
    // });
    this.authenticationService.errorMethod$.subscribe(userId => {
      this.userId = userId
      this.fetchSignatures();
    }
    );
    
  }

  ngOnChanges(changes:SimpleChanges){
    if('reportId' in changes){
    this.scheduleData['report_list_id'] = changes.reportId.currentValue; }
    if('scheduleReportData' in changes) {
      this.scheduleData = this.scheduleReportData;
      // //console.log("CHECKING scheduleData in ngOnChanges",this.scheduleData);
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
      // //console.log("EDITING NOW & setting the sc-rep-name:",this.reportName)
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
    //       this.toasterService.error('Please enter valid values!');
    //       return;
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
      // //console.log("SINGLE DATE SETUP");
      this.scheduleData.schedule_for_date = this.multiDatesService.sendingDates[0].toString();
    }
    else{
      // //console.log("MULTIPLE DATES SETUP");
      this.scheduleData.custom_dates = this.multiDatesService.sendingDates;
      this.scheduleData.schedule_for_date = ""
    }

    if(this.schedulingDates.length == 1 && this.scheduleData.custom_dates.length ){
      // //console.log("resetting MULTIPLE DATES prev step");
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
  
  change(value:NgbDateStruct[]){
    // //console.log('ngbdatestruct', value);
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
    //console.log("this.multiDatesService.sendingDates VALUES:",this.multiDatesService.sendingDates)
  }

  public hideCalendar(){
  // //console.log("HIDECALENDAR CALLED!");
  this.calendarHide = !this.calendarHide;
  // //console.log("this.calendarHide value",this.calendarHide);
  }

  public seeingDates(){
    //console.log("LOGGED DATES:",this.values);
  }


  public autoSize(el) {
    let element = el;
    setTimeout(function () {
      element.style.cssText = 'height:auto;';
      let height = element.scrollHeight + 5;
      element.style.cssText = 'height:' + height + 'px';
    }, 0)
  }

  uploadPdf(event) {
    // this.getRecipientList();
    this.file = event.target.files[0];
    if (this.file) {
      this.fileUpload = true;
    }
    this.fileName = this.file.name;

    let fileValues = {};
    fileValues['file_upload'] = this.pdfFile ? (this.pdfFile.nativeElement.files[0] ? this.pdfFile.nativeElement.files[0] : '') : '';
    this.scheduleService.uploadPdf(fileValues).subscribe(res => {
      this.toasterService.success('Successfully uploaded ',this.fileName,);
      // console.log("result obtained",res);
      this.scheduleData.is_file_uploaded = true;
    }, error => {
      this.toasterService.error("File upload error");
      this.scheduleData.is_file_uploaded = false;
    }
    );
  }

  select() {
    this.signSelected = true;
    const selectedSign = this.signatures.find(x =>
      x.signature_name.trim().toLowerCase() == this.scheduleData.signature_html.trim().toLowerCase());
    this.editorData = selectedSign.signature_html;
    this.selected_id = selectedSign.signature_id;
  }


  getRecipientList() {
    console.log("request",this.selectedReqId);   
    this.createReportLayoutService.getRequestDetails(this.selectedReqId).subscribe(
      res => {  this.emails.push(res['user_data']['email']);
      console.log("req_emails",this.emails);
      
      })
  }  
 
  signDeleted(event) {
    this.fetchSignatures().then(result => {
      Utils.hideSpinner();
    });
  }

  // add(event: MatChipInputEvent): void {
  //   const input = this.fruitCtrl.value;
  //   const value = event.value;
  //   this.getDuplicateMessage();
  //   if ((value || '').trim() && !this.fruitCtrl.invalid && !this.isDuplicate) {
  //     this.emails.push(value.trim());
  //   } else {
  //   }
  //   this.fruitCtrl.setValue('');
  // }

  // getDuplicateMessage() {
  //   if (this.emails.includes(this.fruitCtrl.value)) {
  //     this.isDuplicate = true;
  //   }
  //   else {
  //     this.isDuplicate = false;
  //   }
  // };

  // remove(email) {
  //   const index = this.emails.indexOf(email);
  //   if (index >= 0) {
  //     this.emails.splice(index, 1);
  //   }
  // }

  reset() {
    if (this.pdfFile) {
      this.pdfFile['nativeElement']['value'] = "";
    }
    this.fileUpload = false;
  }


  public triggerFileBtn() {
    document.getElementById("valueInput").click();
  }

  public fetchSignatures(callback = null) {
    return new Promise((resolve, reject) => {
      let user_id = this.userId;
      
      this.shareReportService.getSignatures(user_id).subscribe((res: {
        data: {
          signature_id: number,
          signature_name: string,
          signature_html: string,
          user_id: string,
          image_id: number
        }[]
      }) => {
        this.maxSignId = Math.max.apply(null, res.data.map(sign => sign.signature_id)) + 1;
        this.signatures = [{
          "signature_id": this.maxSignId,
          "signature_name": "Create new signature",
          "signature_html": "",
          "user_id": 'USER1',
          "image_id": null
        }, ...res['data']];
        // this.selectSign = this.signatures[0].signature_name;
        for (let i = 0; i < this.signatures.length; ++i) {
          this.signNames[i] = this.signatures[i]["signature_name"];
        }
        resolve(true);
      }, error => {
        reject(error);
      })
    });
  }

  updateSignatureData(options) {
    Utils.showSpinner();
    this.shareReportService.putSign(options).subscribe(
      res => {
        this.toasterService.success("Edited successfully")
        this.fetchSignatures().then((result) => {
          this.scheduleData.signature_html = null;
          Utils.hideSpinner();
          $('#signature').modal('hide');
        }).catch(err => {
          this.toasterService.error(err.message || this.defaultError);
          Utils.hideSpinner();
        })
      }, error => {
        Utils.hideSpinner();
        $('#signature').modal('hide');
      })
  };

  createSignatureData(options) {
    Utils.showSpinner();
    this.shareReportService.createSign(options).subscribe(
      res => {
        this.toasterService.success("Created successfully")
        this.fetchSignatures().then((result) => {
          this.scheduleData.signature_html = null;
          Utils.hideSpinner();
          $('#signature').modal('hide');
        }).catch(err => {
          this.toasterService.error(err.message || this.defaultError);
          Utils.hideSpinner();
        })
      }, error => {
        Utils.hideSpinner();
        $('#signature').modal('hide');
      })
  };


  updateSharingData() { ///mysharing data
    
     }


  // public todayDateMethod(){
  //   let todayTime = new Date();
  //   //console.log("TODAY's DATE:",todayTime);
  //   //console.log("Formatted date BEFORE:",this.todayDate);    
  //   let month = Number(todayTime.getMonth()+1)
  //   let date =  Number(todayTime.getDate()+1)
  //   let year =  Number(todayTime.getFullYear())
  //   //console.log("Today's date:",month,"/",date,"/",year)

  //   this.todayDate = <NgbDateStruct>{ day: todayTime.getDate(), month: todayTime.getMonth()+1, year: todayTime.getFullYear() }
  //   //console.log("Formatted date:",this.todayDate);
  // }


  // public checkEmptyField(){
  //   if(){  

  //   }
  // }

  // onNavigate(event){
  //   //console.log("Navigate event",event);
  //   const targetMonth = event.next.month;
  //   const targetYear = event.next.year;
    // const selectedDay = event.next.day;
    // const selectedDay = 2;

    // this.values = {
    //   year: targetYear,
    //   month:targetMonth,
    //   day: selectedDay
    // }

    // //console.log("CURRENT DATE in values",this.values);
    // this.datesSelected[0].month = targetMonth;
    // this.datesSelected[0].year = targetYear;
    // this.datesSelected[0].day = selectedDay;
    
  // }
}