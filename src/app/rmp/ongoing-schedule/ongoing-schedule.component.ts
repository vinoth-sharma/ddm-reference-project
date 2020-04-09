import { Component, OnInit, Input, SimpleChanges, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

import { ScheduleService } from '../../schedule/schedule.service';
import Utils from 'src/utils';
import { NgToasterComponent } from "../../custom-directives/ng-toaster/ng-toaster.component";
import { MultiDatePickerOngoingService } from '../multi-date-picker-ongoing/multi-date-picker-ongoing.service';
import { ShareReportService } from '../../share-reports/share-report.service';
// import { SemanticReportsService } from '../../semantic-reports/semantic-reports.service'; // temporary fix for RMP standalone

declare var $: any;

//// Angular component developed by DEEPAK URS G V
@Component({
  selector: 'app-ongoing-schedule',
  templateUrl: './ongoing-schedule.component.html',
  styleUrls: ['./ongoing-schedule.component.css']
})
export class OngoingScheduleComponent implements OnInit {
  public isCollapsed: boolean = true;
  public isSharedHidden: boolean;
  public isFtpHidden: boolean;
  public isEmailHidden: boolean;
  public deliveryMethod: any;
  public userId: any = {};
  public showRadio: boolean = true;
  public showNotification: boolean = true;
  public minDate: NgbDateStruct;
  public file: File;
  public loading;
  @ViewChild('pdf')
  public pdfFile: ElementRef;
  public fileName: string = '';
  public fileUpload: boolean = false;
  public signatureName: string;
  public signSelected: boolean = false;
  public description: string = '';
  public signatures: any = [];
  public selected_id: number;
  public selectId: any = '';
  public schedulingDates: any;
  public maxSignId: number;
  public signNames: any = [];
  public defaultError: string = "There seems to be an error. Please try again later.";

  public dateValue: string;
  public calendarHide: boolean;
  public values: any = [];
  public isDatePickerHidden: boolean = true;
  public stopSchedule: boolean = false;
  public isEmptyFields: boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public fruitCtrl = new FormControl('', [Validators.required]);
  public isDuplicate: boolean = false;
  public autoUserList: any = [];
  public emails: any = [];
  public removable: boolean = true;
  public requestIds: any = [];
  public dataObj: any;
  public roles: any;
  public roleName: any;
  public hideFtp: boolean = false;
  public showSignatureEditor: boolean = false;
  public isDqmActive: boolean = false;
  public recurringButtonValue: boolean = false;
  public isSetFrequencyHidden: boolean = true;
  public isRequestIdFound: boolean = true;
  public todaysDate: string = '';
  public isEditingMode: boolean = false;
  public signatureModel = false;
  public inputParams: any;
  public isOverRideData: boolean = false;

  @Input() reportId: number;
  @Input() reportName: string;
  @Input() scheduleChanges: boolean;
  @Input() selectedReqId: number;
  @Input() requestReport: number;
  @Input() scheduleReportData: any = {};
  @Output() update = new EventEmitter();

  public reportFormats = [
    { 'value': 1, 'display': 'Csv' },
    { 'value': 2, 'display': 'Xlsx' },
  ];

  public sharingModes = [
    { 'value': 1, 'display': 'Email' },
    { 'value': 2, 'display': 'FTP' },
    { 'value': 3, 'display': 'ECS' }
  ]

  public sharingModesNonAdmins = [
    { 'value': 1, 'display': 'Email' },
    { 'value': 3, 'display': 'ECS' }
  ]

  public recurrencePattern = [
    { 'value': 1, 'display': 'Every day' },
    { 'value': 2, 'display': 'Every week' },
    { 'value': 3, 'display': 'Every month' },
    { 'value': 4, 'display': 'Every year' },
    { 'value': 5, 'display': 'Custom' }
  ]

  public recurringChoice = [
    { 'value': 'true', 'display': 'Yes' },
    { 'value': 'false', 'display': 'No' },
  ];

  public notificationChoice = [
    { 'value': 'true', 'display': 'Yes' },
    { 'value': 'false', 'display': 'No' },
  ];


  public previousScheduleDetails = {
    sl_id: '',
    created_by: '',
    report_list_id: '',
    report_name: '',
    schedule_for_date: '',
    schedule_for_time: '',
    custom_dates: [],
    recurring_flag: '',
    recurrence_pattern: '',
    export_format: '',
    report_request_id: '',
    notification_flag: '',
    sharing_mode: '',
    multiple_addresses: [],
    dl_list_flag: '',
    ftp_port: '',
    ftp_folder_path: '',
    ftp_address: '',
    ftp_user_name: '',
    ftp_pd: '',
    modified_by: '',
    dl_list: [],
    description: '',
    signature_html: '',
    is_file_uploaded: '',
    uploaded_file_name: '',
    ecs_file_object_name: '',
    ecs_bucket_name: '',
    request_id: '',
    is_Dqm: ''
  };

  public scheduleData = {
    sl_id: '',
    created_by: '',
    report_list_id: '',
    report_request_id: '',
    report_name: '',
    schedule_for_date: '',
    schedule_for_time: '',
    custom_dates: [],
    recurring_flag: '',
    recurrence_pattern: '',
    export_format: '',
    notification_flag: '',
    sharing_mode: '',
    multiple_addresses: [],
    dl_list_flag: '',
    ftp_port: '',
    ftp_folder_path: '',
    ftp_address: '',
    ftp_user_name: '',
    ftp_pd: '',
    modified_by: '',
    dl_list: [],
    description: '',
    signature_html: '',
    is_file_uploaded: '',
    uploaded_file_name: '',
    ecs_file_object_name: '',
    ecs_bucket_name: '',
    request_id: '',
    is_Dqm: ''
  };

  constructor(public scheduleService: ScheduleService,
    public toasterService: NgToasterComponent,
    public multipleDatesSelectionOngoingService: MultiDatePickerOngoingService,
    private router: Router,
    public authenticationService: AuthenticationService,
    // private semanticReportsService:SemanticReportsService // temporary fix for RMP standalone
    private shareReportService: ShareReportService
  ) { }


  ngOnInit() {
    this.isFtpHidden = true;
    this.minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
    this.showRadio = false;
    this.showNotification = false;
    this.loading = true;

    if ('report_list_id' in this.scheduleReportData) {
      this.scheduleData = this.scheduleReportData;
    }
    else {
      this.scheduleData = {
        sl_id: '',
        created_by: '',
        report_list_id: this.reportId ? this.reportId.toString() : '',
        report_request_id: this.selectedReqId ? this.selectedReqId.toString() : '',
        report_name: this.reportName ? this.reportName : '',
        schedule_for_date: '',
        schedule_for_time: '',
        custom_dates: [],
        recurring_flag: '',
        recurrence_pattern: '',
        export_format: '',
        notification_flag: '',
        sharing_mode: '',
        multiple_addresses: [],
        dl_list_flag: '',
        ftp_port: '',
        ftp_folder_path: '',
        ftp_address: '',
        ftp_user_name: '',
        ftp_pd: '',
        modified_by: '',
        dl_list: [],
        description: '',
        signature_html: '',
        is_file_uploaded: '',
        uploaded_file_name: '',
        ecs_file_object_name: '',
        ecs_bucket_name: '',
        request_id: '',
        is_Dqm: ''
      };
    }
    this.calendarHide = true;

    this.authenticationService.errorMethod$.subscribe(userId => {
      this.userId = userId;
      this.fetchSignatures();

    });

    this.authenticationService.myMethod$.subscribe((arr) => {
      let userDetails = arr;
      this.roles = { 'first_name': userDetails.first_name, 'last_name': userDetails.last_name };
      this.roleName = userDetails.role;

      if (this.roleName === 'Non Admin') {
        this.hideFtp = true;
      }
    });

    this.fruitCtrl.valueChanges.pipe(
      distinctUntilChanged())
      .subscribe(value => {
        if ((value || '').trim() && value.length >= 3) {
          this.shareReportService.verifyUser(value).subscribe(res => {
            this.autoUserList = res['data'];
            this.loading = false;
          })
        }
      });

  }

  ngOnChanges(changes: SimpleChanges) {
    this.isEditingMode = false;

    if ('reportId' in changes && changes.reportId.currentValue) {
      if ('reportName' in changes && changes.reportName.currentValue) {
        this.scheduleData['report_name'] = changes.reportName.currentValue;
      }
      let reportIdProcured = changes.reportId.currentValue;
      this.scheduleData['report_list_id'] = changes.reportId.currentValue;

      this.scheduleService.getRequestDetailsForScheduler(reportIdProcured).subscribe(res => {
        this.dataObj = res["data"];
        if (this.dataObj.length) {
          let request_id = this.dataObj.map(val => val.request_id);
          this.scheduleData.request_id = request_id;
          this.scheduleData.report_list_id = reportIdProcured;
          this.isRequestIdFound = true;
          this.getRecipientList();
        }
        else {
          this.isRequestIdFound = false;
          this.loading = false;
        }
      }, error => {
        this.toasterService.error(error);
      });
    }

    if ('scheduleReportData' in changes && this.scheduleReportData) {
      this.isEditingMode = true;
      this.isDatePickerHidden = false;
      this.scheduleData.request_id = ''; // as the this.scheduleData.request_id was not being reset
      this.scheduleData.report_list_id = '';
      this.scheduleData.report_name = '';
      this.scheduleData = this.scheduleReportData;
      this.scheduleData.report_name = this.scheduleReportData.report_name; // as the edit report's call was not showing report-name
      this.loading = false;
      this.changeDeliveryMethod(this.scheduleData.sharing_mode);

      if (this.scheduleData.request_id && this.scheduleData.request_id == null || this.scheduleData.request_id == '' || this.scheduleData.request_id == undefined) {
        this.isRequestIdFound = false;
      }

      if (this.scheduleData.recurring_flag) {
        this.isSetFrequencyHidden = false;
      }

      if (this.scheduleData.description && this.scheduleData.description.length) {
        let descInpBox = document.getElementById("description");
        descInpBox.innerHTML = this.scheduleData.description;
      }

      if (this.scheduleData.signature_html && this.scheduleData.signature_html.length) {
        this.signatures.forEach(t => {
          if (t.signature_html === this.scheduleData.signature_html) {
            this.scheduleData.signature_html = t.signature_html;
          }
        })
      }

      if (this.scheduleData.schedule_for_date != null) {
        this.multipleDatesSelectionOngoingService.datesChosen = [this.scheduleData.schedule_for_date];
      }
      else if (this.scheduleData.custom_dates) {
        this.multipleDatesSelectionOngoingService.datesChosen = this.scheduleData.custom_dates;
      }
    }

    if ('scheduleChanges' in changes && changes.scheduleChanges.currentValue != 0) {
      let pageAddress = window.location.href;
      if (pageAddress && pageAddress.length && !pageAddress.includes('/semantic/sem-reports/home')) {
        this.scheduleData = this.previousScheduleDetails;
      }
    }

    if (this.reportName) {
      this.scheduleData.report_name = this.reportName;
    }

    if (this.scheduleData && this.scheduleData.multiple_addresses) {
      this.emails = this.scheduleData.multiple_addresses
    }

  }

  public changeDeliveryMethod(deliveryMethod) {
    this.isFtpHidden = true;
    if (deliveryMethod === "2" || deliveryMethod === 2) {
      this.isFtpHidden = false;
    }
    else {
      this.isFtpHidden = true;
    }

  }

  // main method to schedule/edit a scheduled report
  public scheduleReport() {

    if (this.description && this.description.length) {
      this.scheduleData.description = this.description; // to set the HTML value equivalent of the description
    }
    else {
      this.transformDescription();
    }

    this.getSchedulingDates();
    this.checkingDates(); // using this method to overcome rescheduling invalid dates problem
    this.checkEmptyField();

    if ((this.scheduleData['custom_dates'] === null || (this.scheduleData['custom_dates'] != null && this.scheduleData['custom_dates'].length != 0)) && (this.scheduleData['recurrence_pattern'] != null && this.scheduleData['recurrence_pattern'].toString().length === 0)) {
      this.toasterService.error('Please select the CUSTOM option as recurring frequency to schedule the report!');
      return;
    }

    if (this.isEmptyFields == false && this.stopSchedule == false) {

      Utils.showSpinner();
      this.authenticationService.errorMethod$.subscribe(userId => this.userId = userId);
      this.scheduleData.created_by = this.userId;
      this.scheduleData.modified_by = this.userId;
      this.scheduleData.is_Dqm = (false).toString(); // temporary fix for RMP standalone

      this.scheduleService.updateScheduleData(this.scheduleData).subscribe(res => {
        this.toasterService.success('Report scheduled successfully');
        this.multipleDatesSelectionOngoingService.datesChosen = [];
        this.scheduleService.scheduleReportIdFlag = undefined;
        Utils.hideSpinner();
        Utils.closeModals();
        this.update.emit('updated');
      }, error => {
        Utils.hideSpinner();
        this.toasterService.error('Report schedule failed');
      });
    }
    else {
      if (this.stopSchedule === true) {
        this.toasterService.error('Please remove the previously notified INVALID scheduling dates and continue!');
      }
    }

  }

  public getSchedulingDates() {
    let procuredDates = this.multipleDatesSelectionOngoingService.datesChosen;
    if (procuredDates && procuredDates.length == 1) {
      this.scheduleData.schedule_for_date = procuredDates[0];
    }
    else if (procuredDates && procuredDates.length > 1) {
      this.scheduleData.custom_dates = procuredDates;
      this.scheduleData.schedule_for_date = ''
    }
  }

  public setNotificationValue(value) {
    this.scheduleData.notification_flag = value;
  }

  //setting the recurring flag and handling dtae selection
  public setRecurringFlag(value) {
    this.isDatePickerHidden = false;
    this.isSetFrequencyHidden = true;
    if (value == 'true') {
      this.isSetFrequencyHidden = false;
      this.multipleDatesSelectionOngoingService.recurrencePattern = '';
      this.scheduleData.recurring_flag = '';
    }
    else {
      this.isSetFrequencyHidden = true;
      this.multipleDatesSelectionOngoingService.recurrencePattern = '';
    }

    this.scheduleData.recurring_flag = value;
    if (value === 'true') {
      this.multipleDatesSelectionOngoingService.isRecurringDatesMode = true;
    }
    else if (value === 'false') {
      this.multipleDatesSelectionOngoingService.isRecurringDatesMode = false;
    }

    if (this.scheduleData.custom_dates.length) {
      this.scheduleData.custom_dates = [];
      this.toasterService.warning("All the multiple dates are removed!!")
      this.toasterService.success("Please select a new date!")
    }

    this.scheduleData.recurrence_pattern = '';
  }

  public setMultipleAddressListValues() {
    this.scheduleData.multiple_addresses = [...this.emails];
  }

  public setSendingDates() {
    if (this.schedulingDates) {
      if (this.schedulingDates.length > 1) {
        this.scheduleData.schedule_for_date = ""
      }
      if (this.schedulingDates.length == 1 && this.scheduleData.custom_dates.length) {
        this.scheduleData.custom_dates = []
      }
    }
  }

  // selecting the recurrance dates
  public setCollapse(recurrencePattern: string) {
    this.multipleDatesSelectionOngoingService.recurrencePattern = recurrencePattern;
    if (recurrencePattern === "1") {
      this.isDatePickerHidden = true;
      let todaysDateObject = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
      this.todaysDate = todaysDateObject.month + '/' + todaysDateObject.day + '/' + todaysDateObject.year
      this.multipleDatesSelectionOngoingService.datesChosen = [this.todaysDate];
      this.isOverRideData = true;
      this.setSendingDates();
    }
    else if (recurrencePattern === "5") {
      if (this.todaysDate.length) {
        this.todaysDate = '';
        this.multipleDatesSelectionOngoingService.datesChosen = [];
      }
      this.isDatePickerHidden = false;
      this.toasterService.warning("Please select custom dates from the date selector now! Ignore this message if already done!");
      this.setSendingDates();
    }
    else {
      if (this.todaysDate.length) {
        this.todaysDate = '';
        this.multipleDatesSelectionOngoingService.datesChosen = [];
      }
      this.isCollapsed = true;
      this.isDatePickerHidden = false;
    }
  }

  // checking dates whether old or not
  public checkingDates() {
    if (!this.isEditingMode) {
      this.stopSchedule = false;
      if (this.multipleDatesSelectionOngoingService.datesChosen && this.multipleDatesSelectionOngoingService.datesChosen.length) {
        this.multipleDatesSelectionOngoingService.datesChosen.forEach(date => {
          let d1 = new Date(date);
          this.minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
          let d2 = this.minDate.year + "/" + this.minDate.month + "/" + this.minDate.day
          let d3 = new Date(d2);
          let timeDifference = d1.getTime() - d3.getTime();
          let daysDifference = timeDifference / (1000 * 3600 * 24);
          if (daysDifference < 0) {
            this.stopSchedule = true;
            this.toasterService.error('Please deselect the INVALID date(' + date + ') and continue with dates starting from TODAY to schedule the report!');
            return;
          }
        });
      }
    }
  }

  // autosizing of descfription box
  public autoSize(el) {
    let element = el;
    setTimeout(function () {
      element.style.cssText = 'height:auto;';
      let height = element.scrollHeight + 5;
      element.style.cssText = 'height:' + height + 'px';
    }, 0)
  }

  // PDF upload method
  public uploadPdf(event) {
    this.file = event.target.files[0];
    if (this.file) {
      this.fileUpload = true;
    }
    this.fileName = this.file.name;

    let fileValues = {};
    fileValues['file_upload'] = this.pdfFile ? (this.pdfFile.nativeElement.files[0] ? this.pdfFile.nativeElement.files[0] : '') : '';
    this.scheduleService.uploadPdf(fileValues).subscribe(res => {
      this.toasterService.success('Successfully uploaded ' + this.fileName);
      this.scheduleData.is_file_uploaded = 'true';
      this.scheduleData['uploaded_file_name'] = res['uploaded_file_name'];
      this.scheduleData['ecs_file_object_name'] = res['ecs_file_object_name'];
      this.scheduleData['ecs_bucket_name'] = res['ecs_bucket_name'];
    }, error => {
      this.toasterService.error("File upload error");
      this.scheduleData.is_file_uploaded = 'false';
    }
    );
  }

  // Selecting respective selected signature details
  public select(signatureName) {
    this.signSelected = true;
    this.inputParams = this.signatures.find(x =>
      x.signature_html.trim().toLowerCase() == signatureName.target.value.trim().toLowerCase());
    this.scheduleData.signature_html = this.inputParams.signature_html;
  }

  public openSignatureModel() {
    this.signatureModel = true;
    setTimeout(() => {
      document.getElementById('signScheduleModel').click();
    }, 5);
  }

  // getting the email list
  public getRecipientList() {
    this.scheduleService.getRequestDetails(this.scheduleData.request_id).subscribe(res => {
      if (res) {
        this.loading = false;
        if (res['dl_list'].length) {
          let selectedEmails = res['dl_list'].map(i => i.distribution_list);
          this.emails = selectedEmails;
          this.scheduleData.multiple_addresses = this.emails;
        }
        else {
          this.emails = [];
          this.scheduleData.multiple_addresses = [];
          this.loading = false;
        }
      }
      else {
        this.emails = [];
        this.scheduleData.multiple_addresses = [];
        this.loading = false;
      }
    })
  }

  public signSchedularDeleted(event) {
    this.fetchSignatures().then(result => {
      Utils.hideSpinner();
    });
    this.signatureModel = false;
    this.signSelected = false;
  }

  public add(event: MatChipInputEvent): void {
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

  public onSelectionChanged(data) {
    this.getDuplicateMessage(data.option.value);
    if (data.option.value && !this.isDuplicate) {
      this.emails.push(data.option.value);
    }
    this.fruitCtrl.setValue('');
  }

  public getDuplicateMessage(data) {
    if (this.emails.includes(data)) {
      this.isDuplicate = true;
    }
    else {
      this.isDuplicate = false;
    }
  };

  public remove(email) {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
    this.scheduleData.multiple_addresses = [...this.emails];
  }

  public reset() {
    if (this.pdfFile) {
      this.pdfFile['nativeElement']['value'] = "";
    }
    this.fileUpload = false;
  }

  public fetchSignatures(signatureNameStateObject?: any, callback = null) {
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


        if (signatureNameStateObject && signatureNameStateObject.name.length) {
          this.signatures.forEach(t => {
            if (t.signature_html === signatureNameStateObject.html) {
              this.scheduleData.signature_html = signatureNameStateObject.html;
            }
          })
        }

        resolve(true);
      }, error => {
        reject(error);
      })
    });
  }

  public updateSchedularSignatureData(options) {
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

  public createSchedularSignatureData(options) {
    Utils.showSpinner();
    let creatingSignatureNameObject = options;
    this.shareReportService.createSign(options).subscribe(
      res => {
        if (res) {
          this.scheduleData.signature_html = creatingSignatureNameObject.name;
          this.fetchSignatures(creatingSignatureNameObject);
          this.toasterService.success("Signature created successfully")
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

  // mandatory checks to see whether fields are empty or not
  public checkEmptyField() {
    this.isEmptyFields = false;
    if (this.scheduleData.report_name.length === 0) {
      this.toasterService.error('Please reopen this modal to schedule the report!');
      this.isEmptyFields = true;
    }
    else if ((this.scheduleData.schedule_for_date === null || this.scheduleData.schedule_for_date.length === 0) && (this.scheduleData.custom_dates === null || this.scheduleData.custom_dates.length === 0)) {
      this.toasterService.error('Please select valid date/s to schedule the report!');
      this.isEmptyFields = true;
    }
    else if (this.scheduleData.schedule_for_time.length < 5) {
      this.toasterService.error('Please select a valid time to schedule the report!');
      this.isEmptyFields = true;
    }
    else if (this.scheduleData.recurring_flag.length === 0) {
      this.toasterService.error('Please select valid recurrance value to schedule the report!');
      this.isEmptyFields = true;
    }
    else if (this.scheduleData.recurring_flag.toString().length === 4 && this.scheduleData.recurrence_pattern === "") {
      this.toasterService.error('Please select valid recurrance frequency to schedule the report!');
      this.isEmptyFields = true;
    }
    else if (this.scheduleData.export_format != '1' && this.scheduleData.export_format != '2') {
      this.toasterService.error('Please select valid export format!');
      this.isEmptyFields = true;
    }
    else if (this.scheduleData.notification_flag.length === 0) {
      this.toasterService.error('Please select valid NOTIFICATION value to schedule the report!');
      this.isEmptyFields = true;
    }
    else if (this.scheduleData.multiple_addresses.length === 0) {
      this.toasterService.error('Please select valid email address/s to schedule the report!');
      this.isEmptyFields = true;
    }
    else if (this.scheduleData.sharing_mode.length === 0) {
      this.toasterService.error('Please select valid delivery method to schedule the report!');
      this.isEmptyFields = true;
    }
    else if (this.scheduleData.sharing_mode === "2" &&
      (this.scheduleData.ftp_address.length === 0 || this.scheduleData.ftp_pd.length === 0 ||
        this.scheduleData.ftp_port.length === 0 || this.scheduleData.ftp_user_name.length === 0)
    ) {
      this.toasterService.error('Please enter FTP details properly to schedule the report!');
      this.isEmptyFields = true;
    }
    else if (this.scheduleData.description.length === 0) {
      this.toasterService.error('Please provide valid description to schedule the report!');
      this.isEmptyFields = true;
    }
  }

  // capturing html text values respectively
  public transformDescription() {
    let descriptionValue = document.getElementById("description");
    this.description = descriptionValue.innerHTML;
  }

  // refreshing all the modal details
  public refreshScheduleData() {
    let previousReportName = this.scheduleData.report_name;
    let previousRequestId = this.scheduleData.request_id;
    let previousReportId = this.scheduleData.report_list_id;
    this.previousScheduleDetails = this.scheduleData;
    this.scheduleData = {
      sl_id: '',
      created_by: '',
      report_list_id: '',
      report_request_id: '',
      report_name: '',
      schedule_for_date: '',
      schedule_for_time: '',
      custom_dates: [],
      recurring_flag: '',
      recurrence_pattern: '',
      export_format: '',
      notification_flag: '',
      sharing_mode: '',
      multiple_addresses: [],
      dl_list_flag: '',
      ftp_port: '',
      ftp_folder_path: '',
      ftp_address: '',
      ftp_user_name: '',
      ftp_pd: '',
      modified_by: '',
      dl_list: [],
      description: '',
      signature_html: '',
      is_file_uploaded: '',
      uploaded_file_name: '',
      ecs_file_object_name: '',
      ecs_bucket_name: '',
      request_id: '',
      is_Dqm: ''
    };
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
    this.file = null;
    this.fileUpload = false;
    this.recurringButtonValue = false;
    this.multipleDatesSelectionOngoingService.datesChosen = [];
    this.isDatePickerHidden = true;
  }
}