import { Component, OnInit,Input, SimpleChanges, ElementRef, Output, EventEmitter ,ViewChild} from '@angular/core';
// import * as $ from "jquery";
import { AuthenticationService } from '../authentication.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { ScheduleService } from './schedule.service';
import { MultiDateService } from '../multi-date-picker/multi-date.service'
import Utils from 'src/utils';
import { ToastrService } from 'ngx-toastr';
// import { scheduled } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
declare var $: any;
import { ShareReportService } from '../share-reports/share-report.service';
import { CreateReportLayoutService } from '../create-report/create-report-layout/create-report-layout.service';
import { SemanticReportsService } from '../semantic-reports/semantic-reports.service';
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
  public loading;
  // public onSelectionChanged;
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
  // public editorData: '';
  maxSignId: number;
  signNames = [];
  defaultError = "There seems to be an error. Please try again later.";
  
  public dateValue : string;
  public calendarHide : boolean;
  public values : any = [];
  public isNotSelectable:boolean = true;

  datesSelected:NgbDateStruct[]=[]; 

  public tags;
  public exportTags;
  public statusCheck = false;
  public newTags = [];
  public inputTag: string;
  public multipleAddresses: string;
  public stopSchedule: boolean = false;
  public isEmptyFields:boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA]; 
  fruitCtrl = new FormControl('', [Validators.required]);
  isDuplicate: boolean = false;
  autoUserList = [];
  emails = [];
  removable = true;
  requestIds:any = [];
  dataObj:any;
  roles:any;
  roleName:any;
  public hideFtp: boolean = false;
  public showSignatureEditor:boolean = false;
  public isDqmActive:boolean = false;
  public recurringButtonValue : boolean = false;
  public isSetFrequencyHidden : boolean = true;
  public isRequestIdFound : boolean = true;
  public todaysDate : string = '';
  // public reportIdProcuredFromChanges : any ;
  
  // public todayDate:NgbDateStruct;
  // @Input() report_list_id : number;
  @Input() reportId: number;
  @Input() reportName: string;
  @Input() scheduleChanges : boolean;
  @Input() selectedReqId: number;
  @Input() requestReport: number;
  // @Input() reportId : number;
  @Input() scheduleReportData: any = {};
  @Output() update = new EventEmitter();
  @Output() dateMode = new EventEmitter();

  signatureModel = false;
  inputParams: any;



  public reportFormats = [
    {'value': 1, 'display': 'Csv'},
    {'value': 2, 'display': 'Xlsx'},
  ];

  public sharingModes = [
    {'value': 1, 'display': 'Email'},
    {'value': 2, 'display': 'FTP'},
    {'value': 3, 'display': 'ECS'}
  ]

  public sharingModesNonAdmins = [
    {'value': 1, 'display': 'Email'},
    {'value': 3, 'display': 'ECS'}
  ]

  public recurrencePattern = [
    {'value': 1, 'display': 'Every day'},
    {'value': 2, 'display': 'Every week'},
    {'value': 3, 'display': 'Every month'},
    {'value': 4, 'display': 'Every year'},
    {'value': 5, 'display': 'Custom'}
  ]

  public recurringChoice = [
    {'value': 'true', 'display': 'Yes'},
    {'value': 'false', 'display': 'No'},
  ];

  public notificationChoice = [
    {'value': 'true', 'display': 'Yes'},
    {'value': 'false', 'display': 'No'},
  ];


  public previousScheduleDetails = {
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
  report_request_id: '',
  notification_flag:'',
  sharing_mode:'',
  multiple_addresses:[],
  dl_list_flag:'',
  ftp_port:'',
  ftp_folder_path:'',
  ftp_address: '',
  ftp_user_name:'',
  ftp_pd:'',
  modified_by:'',
  dl_list:[],
  description:'',
  signature_html:'',
  is_file_uploaded:'',
  uploaded_file_name:'',
  ecs_file_object_name:'',
  ecs_bucket_name:'',
  request_id:'',
  is_Dqm:''
};

public scheduleData = {
  sl_id:'',
  created_by:'',
  report_list_id:'',
  report_request_id: '',
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
  ftp_pd:'',
  modified_by:'',
  dl_list:[],
  description:'',
  signature_html:'',
  is_file_uploaded:'',
  uploaded_file_name:'',
  ecs_file_object_name:'',
  ecs_bucket_name:'',
  request_id:'',
  is_Dqm:''
};

  constructor(public scheduleService: ScheduleService,
              public multiDateService: MultiDateService,
              public toasterService: ToastrService,
              private router: Router,
              public authenticationService: AuthenticationService,
              private shareReportService: ShareReportService,
              private createReportLayoutService : CreateReportLayoutService,
              private semanticReportsService:SemanticReportsService) { }


  ngOnInit() {

    // console.log('schedular is executing------');

    this.isFtpHidden = true;
    this.minDate = {year: new Date().getFullYear(), month : new Date().getMonth()+1, day: new Date().getDate()}
    this.showRadio = false;
    this.showNotification = false;
    this.loading = true;
    // this.refreshScheduleData();

    if('report_list_id' in this.scheduleReportData){
      // console.log("The set this.scheduleData['report_list_id'] is : ",this.scheduleData['report_list_id']);
      this.scheduleData = this.scheduleReportData;
    }
    else{
      this.scheduleData = {
        sl_id:'',
        created_by:'',
        report_list_id: this.reportId ? this.reportId.toString() : '',
        report_request_id: this.selectedReqId ? this.selectedReqId.toString() : '',
        report_name: this.reportName ? this.reportName : '',
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
        ftp_pd:'',
        modified_by:'',
        dl_list:[],
        description:'',
        signature_html:'',
        is_file_uploaded:'',
        uploaded_file_name:'',
        ecs_file_object_name:'',
        ecs_bucket_name:'',
        request_id:'',
        is_Dqm:''
    };
    // this.reportIdProcuredFromChanges = '';
    }
    this.calendarHide = true;

    this.authenticationService.errorMethod$.subscribe(userId => {
      this.userId = userId;
      this.fetchSignatures();

    });

    this.authenticationService.myMethod$.subscribe((arr) => {
      let userDetails = arr;
      this.roles= {'first_name': userDetails.first_name,'last_name' : userDetails.last_name};
      this.roleName = userDetails.role;
      
      if(this.roleName === 'Non Admin'){
        this.hideFtp = true;
      }
    });

    this.fruitCtrl.valueChanges
    .distinctUntilChanged()
    .subscribe(value => {
      if ((value || '').trim() && value.length >= 3) {
        // this.loading = true; REMOVE BOTH IF ERROR
        // this.loading = true;
        this.shareReportService.verifyUser(value).subscribe(res => {
          this.autoUserList = res['data'];
          this.loading = false;
        })
      }
    });
    
  }

  ngOnChanges(changes:SimpleChanges){
    // console.log("old schedule values check : ",this.scheduleData);
    // this.scheduleData.request_id = ''; // as the this.scheduleData.request_id was not being reset
    // this.scheduleData.report_list_id = '';
    // this.scheduleData.report_name = '';

    // console.log("CHANGES SEEN new version",changes);
    this.isDqmActive  = this.semanticReportsService.isDqm;
    // this.isRequestIdFound = true;
    
    if('reportId' in changes && changes.reportId.currentValue){
      // this.scheduleData.request_id = ''; // as the this.scheduleData.request_id was not being reset
      // this.scheduleData.report_list_id = '';
      // this.scheduleData.report_name = '';
    // this.scheduleData['report_list_id'] = changes.reportId.currentValue.report_id; 
    // let reportIdProcured = changes.reportId.currentValue.report_id;
    
    if('reportName' in changes && changes.reportName.currentValue){
      this.scheduleData['report_name'] = changes.reportName.currentValue; 
    }
    let reportIdProcured = changes.reportId.currentValue;
    // console.log("The set this.scheduleData['report_list_id'] BEFORE is : ",this.scheduleData['report_list_id']);
    this.scheduleData['report_list_id'] = changes.reportId.currentValue; 
    // console.log("The set this.scheduleData['report_list_id'] is : ",this.scheduleData['report_list_id']);
    
    // this.reportIdProcuredFromChanges = changes.reportId.currentValue;
    // let changesFlagOfReportId = true

    this.scheduleService.getRequestDetailsForScheduler(reportIdProcured).subscribe(res => {
      this.dataObj = res["data"];
      if(this.dataObj.length){
        let request_id = this.dataObj.map(val=>val.request_id);
      // console.log("Request Id only",request_id);
      this.scheduleData.request_id = request_id;
      this.scheduleData.report_list_id = reportIdProcured;
      this.isRequestIdFound = true;
      this.getRecipientList();
      // console.log("GET REQUEST DETAILS(request_id,request_title)",res)
      }
      else{
        this.isRequestIdFound = false;
        this.loading = false;
      }
      // console.log("Scheduler object : ",this.scheduleData);
      
    }, error => {
      console.log("ERROR NATURE:",error);
      // console.log("Scheduler object : ",this.scheduleData);
    });
    }

    if('scheduleReportData' in changes && this.scheduleReportData) {
      this.scheduleData.request_id = ''; // as the this.scheduleData.request_id was not being reset
      this.scheduleData.report_list_id = '';
      // console.log("The reset this.scheduleData['report_list_id'] is : ",this.scheduleData['report_list_id']);
      this.scheduleData.report_name = '';
      this.scheduleData = this.scheduleReportData;
      // this.scheduleData.request_id = this.scheduleData.request_id
      this.scheduleData.report_name = this.scheduleReportData.report_name; // as the edit report's call was not showing report-name
      // console.log("CHECKING scheduleData in ngOnChanges",this.scheduleData);
      this.changeDeliveryMethod(this.scheduleData.sharing_mode);
      this.loading = false;

      if(this.scheduleData.recurring_flag === undefined){
        this.showRadio = false;
      }
      else if(this.scheduleData.recurring_flag.toString() === "false"){
        this.showRadio = true;
      }
      else if(this.scheduleData.recurring_flag.toString() === "true"){
        this.showRadio = false;
      }
  
      if(this.scheduleData.notification_flag === undefined){
        this.showNotification = false;
      }
      else if(this.scheduleData.notification_flag.toString() === "false"){
        this.showNotification = true;
      }
      else if(this.scheduleData.notification_flag.toString() === "true"){
        this.showNotification = false;
      }

      if(this.scheduleData.request_id && this.scheduleData.request_id == null || this.scheduleData.request_id == '' || this.scheduleData.request_id == undefined){
        this.isRequestIdFound = false;
      }

      // if(this.scheduleData.multiple_addresses.l){

      // }

      if(this.scheduleData.signature_html.length){
        this.signatures.forEach(t=> { 
          if(t.signature_html === this.scheduleData.signature_html )
          {
            // console.log('true object : ',t.signature_name)
            this.scheduleData.signature_html = t.signature_html;
            // console.log("this.scheduleData.signature_html value : ",this.scheduleData.signature_html);
            
          } 
        })
      }


      
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

    if('scheduleChanges' in changes && changes.scheduleChanges.currentValue != 0 ){
      // this.calendarHide = true;
      // console.log("scheduleChanges IDENTIFIED!!!!!!!!!!!!");
      // this.scheduleData.request_id = ''; // as the this.scheduleData.request_id was not being reset
      // this.scheduleData.report_list_id = '';
      // this.scheduleData.report_name = '';
      let pageAddress = window.location.href;
      if(pageAddress && pageAddress.length && !pageAddress.includes('/semantic/sem-reports/home')){
        this.scheduleData = this.previousScheduleDetails;
      }
      // this.scheduleData = this.previousScheduleDetails;
    }

    if(this.reportName){
      this.scheduleData.report_name = this.reportName;
    }

    if(this.requestReport){
      this.scheduleData.request_id = this.requestReport.toString();
    }
    else if(!this.isRequestIdFound && this.requestReport == undefined){
      this.isRequestIdFound = false;
      this.scheduleData.request_id = '';
    }

    if(this.scheduleData && this.scheduleData.multiple_addresses){
      this.emails = this.scheduleData.multiple_addresses
    }
    
  }

  public changeDeliveryMethod(deliveryMethod){
    this.isFtpHidden = true;
    if(deliveryMethod === "2" || deliveryMethod === 2){
      this.isFtpHidden = false;
    }
    else{
      this.isFtpHidden = true;
    }

      // if (this.requestReport) {
      //   this.getRecipientList();
      // }

  }

  public apply(){

    this.scheduleData.description = this.description; // to set the HTML value equivalent of the description
    // this.scheduleData.signature_html = this.inputParams.signature_html;
    this.checkingDates(); // using this method to overcome rescheduling invalid dates problem
    this.checkEmptyField();

    if((this.scheduleData['custom_dates'] === null || this.scheduleData['custom_dates'].length != 0) && this.scheduleData['recurrence_pattern'].toString().length === 0 ){
      this.toasterService.error('Please select the CUSTOM option as recurring frequency to schedule the report!');
      return;
    }

    if(this.isEmptyFields == false && this.stopSchedule == false){
      // if((this.scheduleData['custom_dates'] === null || this.scheduleData['custom_dates'].length != 0) && this.scheduleData['recurrence_pattern'].toString().length === 0 ){
      //   this.toasterService.error('Please select the CUSTOM option as recurring frequency to schedule the report!');
      //   return;
      // }
      Utils.showSpinner();
      this.authenticationService.errorMethod$.subscribe(userId => this.userId = userId);
      this.scheduleData.created_by = this.userId;
      this.scheduleData.modified_by = this.userId;
      this.scheduleData.is_Dqm = (this.semanticReportsService.isDqm).toString();
      // this.scheduleData.description = this.description;
      // this.scheduleService.setFormDescription(this.scheduleData.description);
      
      //TO DO : checking received scheduleReportId to differentiate apply/edit option
      this.scheduleService.updateScheduleData(this.scheduleData).subscribe(res => {
        // ,this.reportIdProcuredFromChanges
        this.toasterService.success('Report scheduled successfully');
        this.scheduleService.scheduleReportIdFlag = undefined;
        Utils.hideSpinner();
        Utils.closeModals();
        this.update.emit('updated');
        this.router.navigate(['semantic/sem-reports/scheduled-reports']);
        // this.reportIdProcuredFromChanges = '';
      }, error => {
        Utils.hideSpinner();
        this.toasterService.error('Report schedule failed');
      });
    }
    else{
      if(this.stopSchedule === true){
        this.toasterService.error('Please remove the previously notified INVALID scheduling dates and continue!');
      }
    }

  }

  public setNotificationValue(value){
    //// CHECK ALSO WHETHER THIS METHOD IS NEEDED OR NOT OR DIRECT NGMODEL IS HAPPENING
    this.scheduleData.notification_flag = value;
  }

  public setRecurringFlag(value){
    this.isNotSelectable = true;    
    this.isSetFrequencyHidden = true;
    if(value == 'true'){ //  || value == true
      this.isSetFrequencyHidden = false;
    }
    else{
      this.isSetFrequencyHidden = true;
    }

    this.scheduleData.recurring_flag = value;
    if(value === 'true'){
      this.multiDateService.dateMode = true;
    }
    else if(value === 'false'){
      this.multiDateService.dateMode = false;
    }
    
    if(value.length != 0){
      this.isNotSelectable = false;
    }

    // console.log(" SINGLE DATE : ",this.scheduleData.schedule_for_date);
    // console.log("MULTIPLE DATES : ",this.scheduleData.custom_dates);
    
    
    if(this.scheduleData.custom_dates.length){
      this.scheduleData.custom_dates = [];
      this.multiDateService.sendingDates = [];
      this.values = [];
      this.datesSelected = []; // this clearance removes the yellow marking also
      this.toasterService.warning("All the multiple dates are removed!!")
      this.toasterService.success("Please select a new date!")
    }


  }

  public setMultipleAddressListValues(){
    this.scheduleData.multiple_addresses = [...this.emails];
  }

  public setCustomValue(){
    this.isCollapsed = !this.isCollapsed;
  }

  public schedulingDates;
  public setSendingDates(){
    // console.log("SETSENDINGDATES() is called in schedule datepicker")
    this.schedulingDates = this.multiDateService.sendingDates;
    // console.log("this.multiDateService.sendingDates ARE:",this.multiDateService.sendingDates)
    if(this.schedulingDates){
    if(this.schedulingDates.length === 1){
      this.scheduleData.schedule_for_date = this.multiDateService.sendingDates[0].toString();
    }
    else{
      this.scheduleData.custom_dates = this.multiDateService.sendingDates;
      this.scheduleData.schedule_for_date = ""
    }

    if(this.schedulingDates.length == 1 && this.scheduleData.custom_dates.length ){
      this.scheduleData.custom_dates = []
    }

  }

  }
  
  public setCollapse(recurrencePattern: string){
    if(recurrencePattern === "1"){
      this.isNotSelectable = true;
      // this.toasterService.warning("Please select custom dates from the date selector now! Ignore this message if already done!");
      let todaysDateObject = {year: new Date().getFullYear(), month : new Date().getMonth()+1, day: new Date().getDate()}
      this.todaysDate = todaysDateObject.month+'/'+todaysDateObject.day+'/'+todaysDateObject.year
      this.multiDateService.sendingDates = [this.todaysDate]
      this.datesSelected = [];
      this.values = [this.todaysDate];
      // console.log("Setting todays date for EVERYDAY check",this.multiDateService.sendingDates);
      
      this.setSendingDates();
    }
    else if(recurrencePattern === "5"){
      if(this.todaysDate.length){
        this.todaysDate = '';
        this.multiDateService.sendingDates = [] 
        this.values = []; 
        // console.log("LATEST this.multiDateService.sendingDates values :",this.multiDateService.sendingDates);
        
      }
      this.isNotSelectable = false;
      this.toasterService.warning("Please select custom dates from the date selector now! Ignore this message if already done!");
      // console.log("LATEST this.multiDateService.sendingDates values for SETSENDINGDTAES :",this.multiDateService.sendingDates);
      this.setSendingDates();
    }
    else{
      if(this.todaysDate.length){
        this.todaysDate = '';
        this.multiDateService.sendingDates = []  
        this.values = []; 
        // console.log("LATEST this.multiDateService.sendingDates values :",this.multiDateService.sendingDates);
      }
      this.isCollapsed = true;
      this.isNotSelectable = false;
      // console.log("LATEST this.multiDateService.sendingDates values FOR OTHER :",this.multiDateService.sendingDates);
    }
  }
  
  change(value:NgbDateStruct[]){
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
    this.multiDateService.sendingDates = this.values;
  }

  public hideCalendar(){
  this.calendarHide = !this.calendarHide;
  }

  public checkingDates(){
      this.stopSchedule = false;
      if(this.values.length){
        this.values.forEach(date => {
          let d1 = new Date(date);
        this.minDate = {year: new Date().getFullYear(), month : new Date().getMonth()+1, day: new Date().getDate()}
        let d2 = this.minDate.year + "/" + this.minDate.month + "/" + this.minDate.day
        let d3 = new Date(d2);
        let timeDifference = d1.getTime() - d3.getTime();
        let daysDifference = timeDifference / (1000 * 3600 * 24);
        // this.stopSchedule = false;  
        if(daysDifference<0){
          this.stopSchedule =true;
          this.toasterService.error('Please deselect the INVALID date('+date+') and continue with dates starting from TODAY to schedule the report!');
          return; 
        }
        else{

        } 
        });
      }
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
    this.file = event.target.files[0];
    if (this.file) {
      this.fileUpload = true;
    }
    this.fileName = this.file.name;

    let fileValues = {};
    fileValues['file_upload'] = this.pdfFile ? (this.pdfFile.nativeElement.files[0] ? this.pdfFile.nativeElement.files[0] : '') : '';
    this.scheduleService.uploadPdf(fileValues).subscribe(res => {
      this.toasterService.success('Successfully uploaded ',this.fileName);
      this.scheduleData.is_file_uploaded = 'true'; // Not needed as true always???
      this.scheduleData['uploaded_file_name'] = res['uploaded_file_name'];
      this.scheduleData['ecs_file_object_name'] = res['ecs_file_object_name'];
      this.scheduleData['ecs_bucket_name'] = res['ecs_bucket_name'];
    }, error => {
      this.toasterService.error("File upload error");
      this.scheduleData.is_file_uploaded = 'false';
    }
    );
  }



  select(signatureName) {
    this.signSelected = true;
    this.inputParams = this.signatures.find(x =>
      x.signature_html.trim().toLowerCase() == signatureName.target.value.trim().toLowerCase());
      console.log("this.inputParams are: ",this.inputParams);

      this.scheduleData.signature_html = this.inputParams.signature_html;
      
      

      // this.signSelected = true;
      // // console.log("CROSS CHECK HTML VALUE:",this.scheduleData.signature_html)
      // // console.log("ALL SIGNATURES",this.signatures)
      // const selectedSign = this.signatures.find(x =>
      //   x.signature_name.trim().toLowerCase() == signatureName.trim().toLowerCase());
      // this.editorData = selectedSign.signature_html;
      // // console.log("Editor data",this.editorData);
      // this.selected_id = selectedSign.signature_id;
      // // console.log("SELECTED ID data",this.selected_id);
      // this.signatures.filter(i=> { 
      //   if(i['signature_id'] === this.selected_id){ 
      //     this.scheduleData.signature_html=i.signature_html;
      //   }
      // }
      // );
  }

  openSignatureModel() {
  this.signatureModel = true;
  setTimeout(() => {
    document.getElementById('signScheduleModel').click();
  }, 5);
  }


  getRecipientList() {
    this.createReportLayoutService.getRequestDetails(this.scheduleData.request_id).subscribe(res => {  
      if(res){
        // this.emails.push(res['user_data']['email']);
        this.loading = false;
        if(res['dl_list'].length){
          let selectedEmails = res['dl_list'].map(i=>i.distribution_list);
          this.emails = selectedEmails;
          this.scheduleData.multiple_addresses = this.emails;
        }
        else{
          // if empty response
          this.emails = [];
          this.scheduleData.multiple_addresses = [];
          this.loading = false;
        }
        // console.log("Curated Emails:",this.emails);
      }
      else{
        // if no response
        this.emails = [];
        this.scheduleData.multiple_addresses = [];
        this.loading = false;
      }
      })
  }  

  signSchedularDeleted(event) {
    this.fetchSignatures().then(result => {
      Utils.hideSpinner();
      // this.scheduleData.signature_html = ''
    });
    this.signatureModel = false;
    this.signSelected = false;
  }

  add(event: MatChipInputEvent): void {
    const input = this.fruitCtrl.value;
    const value = event.value;
    this.getDuplicateMessage(input);
    if ((value || '').trim() && !this.fruitCtrl.invalid && !this.isDuplicate) {
      this.emails.push(value.trim());
    } else {
    }
    this.fruitCtrl.setValue('');
    this.scheduleData.multiple_addresses = [...this.emails];
  }

  onSelectionChanged(data) {
    this.getDuplicateMessage(data.option.value);
    if (data.option.value && !this.isDuplicate) {
      this.emails.push(data.option.value);
    }
    this.fruitCtrl.setValue('');
  }

  getDuplicateMessage(data) {
    // if (this.emails.includes(this.fruitCtrl.value)) {
    //   this.isDuplicate = true;
    // }  CHECKING THIS SIMILAR IMPLEMENTATION
    if (this.emails.includes(data)) {
      this.isDuplicate = true;
    }
    else {
      this.isDuplicate = false;
    }
  };

  remove(email) {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
    this.scheduleData.multiple_addresses = [...this.emails];
  }

  reset() {
    if (this.pdfFile) {
      this.pdfFile['nativeElement']['value'] = "";
    }
    this.fileUpload = false;
  }


  public triggerFileBtn() {
    document.getElementById("valueInput").click();
  }

  public fetchSignatures(signatureNameStateObject? : any,callback = null) {
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
      }
      ) => {
        this.maxSignId = Math.max.apply(null, res.data.map(sign => sign.signature_id)) + 1;
        this.signatures = [{
          "signature_id": this.maxSignId,
          "signature_name": "Create new signature",
          "signature_html": "",
          "user_id": 'USER1',
          "image_id": null
        }, ...res['data']];
        for (let i = 0; i < this.signatures.length; ++i) {
          this.signNames[i] = this.signatures[i]["signature_name"];
        }


    if(signatureNameStateObject && signatureNameStateObject.name.length){
      this.signatures.forEach(t=> { 
        if(t.signature_html === signatureNameStateObject.html )
        {
          console.log('true object : ',t.signature_name)
          this.scheduleData.signature_html = signatureNameStateObject.html;
          console.log("this.scheduleData.signature_html value : ",this.scheduleData.signature_html);
          
        } 
      })}

        resolve(true);
      }, error => {
        reject(error);
      })
    });
  }

  updateSchedularSignatureData(options) {
    Utils.showSpinner();
    let creatingSignatureName = options.name;
    this.shareReportService.putSign(options).subscribe(
      res => {
        this.toasterService.success("Signature edited successfully")
        this.scheduleData.signature_html = creatingSignatureName;
        this.fetchSignatures().then((result) => {
          this.signatureModel = false;
          Utils.hideSpinner();
          $('#signature-schedular').modal('hide');
        }).catch(err => {
          this.signatureModel = false;
          this.toasterService.error(err.message || this.defaultError);
          Utils.hideSpinner();
        })
      }, error => {
        this.signatureModel = false;
        Utils.hideSpinner();
        $('#signature-schedular').modal('hide');
      })
  };

  createSchedularSignatureData(options) {
    Utils.showSpinner();
    let creatingSignatureNameObject = options;
    this.shareReportService.createSign(options).subscribe(
      res => {
        if(res){
        this.scheduleData.signature_html = creatingSignatureNameObject.name;
        this.fetchSignatures(creatingSignatureNameObject); // updating the signatures list , send an optional parameter to update this.scheduleData.signature_html
        this.toasterService.success("Signature created successfully")
        // if(this.scheduleData.signature_html.length){
        //   this.signatures.forEach(t=> { 
        //     if(t.signature_html === this.scheduleData.signature_html )
        //     {
        //       console.log('true object : ',t.signature_name)
        //       this.scheduleData.signature_html = creatingSignatureName;
        //       console.log("this.scheduleData.signature_html value : ",this.scheduleData.signature_html);
              
        //     } 
        //   })}
        this.fetchSignatures().then((result) => {
          Utils.hideSpinner();
          $('#signature-schedular').modal('hide');
        }).catch(err => {
          this.toasterService.error(err.message || this.defaultError);
          Utils.hideSpinner();
        })

        this.signatureModel = false;
      }
      }, error => {
        this.signatureModel = false;
        Utils.hideSpinner();
        $('#signature-schedular').modal('hide');
      })
  };

  public addTags() {
    if (this.multipleAddresses.trim() == '') {
        this.toasterService.info("Cannot save empty tags");
    } else {
        this.scheduleData.multiple_addresses.push(this.multipleAddresses);
        this.multipleAddresses = '';
    }
  }

  public removeTags(index) {
    this.statusCheck = true;
    this.exportTags.splice(index, 1);
  }

  public removeNewTags(index) {
    this.scheduleData.multiple_addresses.splice(index, 1);
  }


  public checkEmptyField(){
    this.isEmptyFields = false;
    if(this.scheduleData.report_name.length === 0 ){  
      this.toasterService.error('Please reopen this modal to schedule the report!');
      this.isEmptyFields = true;
    }
    else if((this.scheduleData.schedule_for_date === null || this.scheduleData.schedule_for_date.length === 0 ) && (this.scheduleData.custom_dates === null || this.scheduleData.custom_dates.length === 0)){
      this.toasterService.error('Please select valid date/s to schedule the report!');
      this.isEmptyFields = true;
    }
    else if(this.scheduleData.schedule_for_time.length < 5 ){  
      this.toasterService.error('Please select a valid time to schedule the report!');
      this.isEmptyFields = true;
    }
    else if(this.scheduleData.recurring_flag.length === 0){
      this.toasterService.error('Please select valid recurrance value to schedule the report!');
      this.isEmptyFields = true;
    }
    else if(this.scheduleData.recurring_flag.toString().length === 4 && this.scheduleData.recurrence_pattern === "" ){
      this.toasterService.error('Please select valid recurrance frequency to schedule the report!');
      this.isEmptyFields = true;
    }
    else if(this.scheduleData.export_format != '1' && this.scheduleData.export_format != '2'){
      this.toasterService.error('Please select valid export format!');
      this.isEmptyFields = true;
    }
    else if(this.scheduleData.notification_flag.length === 0){
      this.toasterService.error('Please select valid NOTIFICATION value to schedule the report!');
      this.isEmptyFields = true;
    }
    else if(this.scheduleData.multiple_addresses.length === 0){
      this.toasterService.error('Please select valid email address/s to schedule the report!');
      this.isEmptyFields = true;
    }
    else if(this.scheduleData.sharing_mode.length === 0){
      this.toasterService.error('Please select valid delivery method to schedule the report!');
      this.isEmptyFields = true;
    }
    else if(this.scheduleData.sharing_mode === "2" &&
        (this.scheduleData.ftp_address.length === 0 || this.scheduleData.ftp_pd.length === 0 ||
            this.scheduleData.ftp_port.length === 0 || this.scheduleData.ftp_user_name.length === 0)
              ){
                this.toasterService.error('Please enter FTP details properly to schedule the report!');
                this.isEmptyFields = true;
    }
    else if(this.scheduleData.description.length === 0){
      this.toasterService.error('Please provide valid description to schedule the report!');
      this.isEmptyFields = true;
    }
    else if(this.scheduleData.signature_html.length === 0){
    // else if(this.inputParams.signature_html.length === 0){
      this.toasterService.error('Please select a valid signature to schedule the report!');
      this.isEmptyFields = true;
    }
  }

  transformDescription() {
    let descriptionValue = document.getElementById("description");
    this.description = descriptionValue.innerHTML;
    // console.log("this.description VALUE : ",this.description);
    // this.scheduleData.description = this.description;  CAPTURING THIS VALUE DURING SUBMISSION
  }

  public refreshScheduleData(){
    let previousReportName = this.scheduleData.report_name;
    let previousRequestId = this.scheduleData.request_id;
    let previousReportId = this.scheduleData.report_list_id;
    this.previousScheduleDetails = this.scheduleData;
      this.scheduleData = {
        sl_id:'',
        created_by:'',
        report_list_id:'',
        report_request_id: '',
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
        ftp_pd:'',
        modified_by:'',
        dl_list:[],
        description:'',
        signature_html:'',
        is_file_uploaded:'',
        uploaded_file_name:'',
        ecs_file_object_name:'',
        ecs_bucket_name:'',
        request_id:'',
        is_Dqm:''
    };
    // }
    this.scheduleData.report_name = previousReportName;
    this.scheduleData.request_id = previousRequestId;
    this.scheduleData.report_list_id = previousReportId;
    this.calendarHide = true;
    this.showRadio = false;
    this.showNotification = false;
    this.values = []
    this.emails = []
    this.isFtpHidden = true;
    document.getElementById("description").innerHTML = '';
    document.getElementById("email").innerHTML = '';
    this.fruitCtrl.setValue('');
    document.getElementById("scheduleTime").innerHTML = '';
    this.file= null;
    this.fileUpload = false;
    this.recurringButtonValue = false;
    // this.reportIdProcuredFromChanges = ''
    // time if not completely
    // date selction not going
    // NO- recurring flag and notification flag

  }

  // DO NOT DELETE THE BELOW CODE
  // public todayDateMethod(){
  //   let todayTime = new Date();
  //   //// console.log("TODAY's DATE:",todayTime);
  //   //// console.log("Formatted date BEFORE:",this.todayDate);    
  //   let month = Number(todayTime.getMonth()+1)
  //   let date =  Number(todayTime.getDate()+1)
  //   let year =  Number(todayTime.getFullYear())
  //   //// console.log("Today's date:",month,"/",date,"/",year)

  //   this.todayDate = <NgbDateStruct>{ day: todayTime.getDate(), month: todayTime.getMonth()+1, year: todayTime.getFullYear() }
  //   //// console.log("Formatted date:",this.todayDate);
  // }


  // onNavigate(event){
  //   //// console.log("Navigate event",event);
  //   const targetMonth = event.next.month;
  //   const targetYear = event.next.year;
    // const selectedDay = event.next.day;
    // const selectedDay = 2;

    // this.values = {
    //   year: targetYear,
    //   month:targetMonth,
    //   day: selectedDay
    // }

    // //// console.log("CURRENT DATE in values",this.values);
    // this.datesSelected[0].month = targetMonth;
    // this.datesSelected[0].year = targetYear;
    // this.datesSelected[0].day = selectedDay;
    
  // }
  
}