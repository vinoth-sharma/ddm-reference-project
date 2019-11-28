import * as tslib_1 from "tslib";
import { Component, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
// import * as $ from "jquery";
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { ScheduleService } from './schedule.service';
import { MultiDateService } from '../multi-date-picker/multi-date.service';
import Utils from 'src/utils';
import { ToastrService } from 'ngx-toastr';
import { ShareReportService } from '../share-reports/share-report.service';
import { CreateReportLayoutService } from '../create-report/create-report-layout/create-report-layout.service';
import { SemanticReportsService } from '../semantic-reports/semantic-reports.service';
// import { format } from 'path';
var ScheduleComponent = /** @class */ (function () {
    function ScheduleComponent(scheduleService, multiDateService, toasterService, router, authenticationService, shareReportService, createReportLayoutService, semanticReportsService) {
        this.scheduleService = scheduleService;
        this.multiDateService = multiDateService;
        this.toasterService = toasterService;
        this.router = router;
        this.authenticationService = authenticationService;
        this.shareReportService = shareReportService;
        this.createReportLayoutService = createReportLayoutService;
        this.semanticReportsService = semanticReportsService;
        this.isCollapsed = true;
        this.userId = {};
        this.showRadio = true;
        this.showNotification = true;
        this.fileUpload = false;
        this.signSelected = false;
        this.signatures = [];
        this.signNames = [];
        this.defaultError = "There seems to be an error. Please try again later.";
        this.values = [];
        this.isNotSelectable = true;
        this.datesSelected = [];
        this.statusCheck = false;
        this.newTags = [];
        this.stopSchedule = false;
        this.isEmptyFields = false;
        this.separatorKeysCodes = [ENTER, COMMA];
        this.fruitCtrl = new FormControl('', [Validators.required]);
        this.isDuplicate = false;
        this.autoUserList = [];
        this.emails = [];
        this.removable = true;
        this.requestIds = [];
        this.hideFtp = false;
        this.showSignatureEditor = false;
        this.isDqmActive = false;
        this.recurringButtonValue = false;
        this.isSetFrequencyHidden = true;
        this.isRequestIdFound = true;
        // @Input() reportId : number;
        this.scheduleReportData = {};
        this.update = new EventEmitter();
        this.dateMode = new EventEmitter();
        this.reportFormats = [
            { 'value': 1, 'display': 'Csv' },
            { 'value': 2, 'display': 'Xlsx' },
        ];
        this.sharingModes = [
            { 'value': 1, 'display': 'Email' },
            { 'value': 2, 'display': 'FTP' },
            { 'value': 3, 'display': 'ECS' }
        ];
        this.sharingModesNonAdmins = [
            { 'value': 1, 'display': 'Email' },
            { 'value': 3, 'display': 'ECS' }
        ];
        this.recurrencePattern = [
            { 'value': 1, 'display': 'Every day' },
            { 'value': 2, 'display': 'Every week' },
            { 'value': 3, 'display': 'Every month' },
            { 'value': 4, 'display': 'Every year' },
            { 'value': 5, 'display': 'Custom' }
        ];
        this.recurringChoice = [
            { 'value': 'true', 'display': 'Yes' },
            { 'value': 'false', 'display': 'No' },
        ];
        this.notificationChoice = [
            { 'value': 'true', 'display': 'Yes' },
            { 'value': 'false', 'display': 'No' },
        ];
        this.previousScheduleDetails = {
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
            ftp_password: '',
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
            ftp_password: '',
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
    ScheduleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isFtpHidden = true;
        this.minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
        this.showRadio = false;
        this.showNotification = false;
        this.loading = true;
        // this.refreshScheduleData();
        if ('report_list_id' in this.scheduleReportData) {
            this.scheduleData = this.scheduleReportData;
        }
        else {
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
                ftp_password: '',
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
        this.authenticationService.errorMethod$.subscribe(function (userId) {
            _this.userId = userId;
            _this.fetchSignatures();
        });
        this.authenticationService.myMethod$.subscribe(function (arr) {
            var userDetails = arr;
            _this.roles = { 'first_name': userDetails.first_name, 'last_name': userDetails.last_name };
            _this.roleName = userDetails.role;
            if (_this.roleName === 'Non Admin') {
                _this.hideFtp = true;
            }
        });
        this.fruitCtrl.valueChanges
            .distinctUntilChanged()
            .subscribe(function (value) {
            if ((value || '').trim() && value.length >= 3) {
                // this.loading = true; REMOVE BOTH IF ERROR
                // this.loading = true;
                _this.shareReportService.verifyUser(value).subscribe(function (res) {
                    _this.autoUserList = res['data'];
                    _this.loading = false;
                });
            }
        });
    };
    ScheduleComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        console.log("CHANGES SEEN new version", changes);
        this.isDqmActive = this.semanticReportsService.isDqm;
        this.isRequestIdFound = true;
        if ('reportId' in changes && changes.reportId.currentValue) {
            // this.scheduleData['report_list_id'] = changes.reportId.currentValue.report_id; 
            // let reportIdProcured = changes.reportId.currentValue.report_id;
            this.scheduleData['report_list_id'] = changes.reportId.currentValue;
            var reportIdProcured = changes.reportId.currentValue;
            this.scheduleService.getRequestDetailsForScheduler(reportIdProcured).subscribe(function (res) {
                _this.dataObj = res["data"];
                if (_this.dataObj.length) {
                    var request_id = _this.dataObj.map(function (val) { return val.request_id; });
                    // console.log("Request Id only",request_id);
                    _this.scheduleData.request_id = request_id;
                    _this.getRecipientList();
                    // console.log("GET REQUEST DETAILS(request_id,request_title)",res)
                }
                else {
                    _this.isRequestIdFound = false;
                    _this.loading = false;
                }
            }, function (error) {
                console.log("ERROR NATURE:", error);
            });
        }
        if ('scheduleReportData' in changes && this.scheduleReportData) {
            this.scheduleData = this.scheduleReportData;
            // this.scheduleData.request_id = this.scheduleData.request_id
            this.scheduleData.report_name = this.scheduleReportData.report_name; // as the edit report's call was not showing report-name
            // console.log("CHECKING scheduleData in ngOnChanges",this.scheduleData);
            this.changeDeliveryMethod(this.scheduleData.sharing_mode);
            if (this.scheduleData.recurring_flag === undefined) {
                this.showRadio = false;
            }
            else if (this.scheduleData.recurring_flag.toString() === "false") {
                this.showRadio = true;
            }
            else if (this.scheduleData.recurring_flag.toString() === "true") {
                this.showRadio = false;
            }
            if (this.scheduleData.notification_flag === undefined) {
                this.showNotification = false;
            }
            else if (this.scheduleData.notification_flag.toString() === "false") {
                this.showNotification = true;
            }
            else if (this.scheduleData.notification_flag.toString() === "true") {
                this.showNotification = false;
            }
            if (this.scheduleData.schedule_for_date != null) {
                var scheduledDate = new Date(this.scheduleData.schedule_for_date);
                this.datesSelected = [{
                        month: scheduledDate.getMonth() + 1,
                        year: scheduledDate.getFullYear(),
                        day: scheduledDate.getDate()
                    }];
                // let date = []
                // date.push(this.scheduleData.schedule_for_date);
            }
            // else{
            else if (this.scheduleData.custom_dates) {
                this.values = this.scheduleData.custom_dates.map(function (date) {
                    var scheduledDate = new Date(date);
                    return {
                        month: scheduledDate.getMonth() + 1,
                        year: scheduledDate.getFullYear(),
                        day: scheduledDate.getDate()
                    };
                });
                this.datesSelected = this.values;
            }
            this.values = this.datesSelected.map(function (date) { return date.month + "/" + date.day + "/" + date.year; });
        }
        if ('scheduleChanges' in changes && changes.scheduleChanges.currentValue != 0) {
            // console.log("scheduleChanges IDENTIFIED!!!!!!!!!!!!");
            this.scheduleData = this.previousScheduleDetails;
        }
        if (this.reportName) {
            this.scheduleData.report_name = this.reportName;
        }
        if (this.requestReport) {
            this.scheduleData.request_id = this.requestReport.toString();
        }
        if (this.scheduleData && this.scheduleData.multiple_addresses) {
            this.emails = this.scheduleData.multiple_addresses;
        }
    };
    ScheduleComponent.prototype.changeDeliveryMethod = function (deliveryMethod) {
        this.isFtpHidden = true;
        if (deliveryMethod === "2" || deliveryMethod === 2) {
            this.isFtpHidden = false;
        }
        else {
            this.isFtpHidden = true;
        }
        // if (this.requestReport) {
        //   this.getRecipientList();
        // }
    };
    ScheduleComponent.prototype.apply = function () {
        var _this = this;
        this.scheduleData.description = this.description; // to set the HTML value equivalent of the description
        this.checkingDates(); // using this method to overcome rescheduling invalid dates problem
        this.checkEmptyField();
        if ((this.scheduleData['custom_dates'] === null || this.scheduleData['custom_dates'].length != 0) && this.scheduleData['recurrence_pattern'].toString().length === 0) {
            this.toasterService.error('Please select the CUSTOM option as recurring frequency to schedule the report!');
            return;
        }
        if (this.isEmptyFields == false && this.stopSchedule == false) {
            // if((this.scheduleData['custom_dates'] === null || this.scheduleData['custom_dates'].length != 0) && this.scheduleData['recurrence_pattern'].toString().length === 0 ){
            //   this.toasterService.error('Please select the CUSTOM option as recurring frequency to schedule the report!');
            //   return;
            // }
            Utils.showSpinner();
            this.authenticationService.errorMethod$.subscribe(function (userId) { return _this.userId = userId; });
            this.scheduleData.created_by = this.userId;
            this.scheduleData.modified_by = this.userId;
            this.scheduleData.is_Dqm = (this.semanticReportsService.isDqm).toString();
            // this.scheduleData.description = this.description;
            // this.scheduleService.setFormDescription(this.scheduleData.description);
            //TO DO : checking received scheduleReportId to differentiate apply/edit option
            this.scheduleService.updateScheduleData(this.scheduleData).subscribe(function (res) {
                _this.toasterService.success('Report scheduled successfully');
                Utils.hideSpinner();
                Utils.closeModals();
                _this.update.emit('updated');
            }, function (error) {
                Utils.hideSpinner();
                _this.toasterService.error('Report schedule failed');
            });
        }
        else {
            if (this.stopSchedule === true) {
                this.toasterService.error('Please remove the previously notified INVALID scheduling dates and continue!');
            }
        }
    };
    ScheduleComponent.prototype.setNotificationValue = function (value) {
        //// CHECK ALSO WHETHER THIS METHOD IS NEEDED OR NOT OR DIRECT NGMODEL IS HAPPENING
        this.scheduleData.notification_flag = value;
    };
    ScheduleComponent.prototype.setRecurringFlag = function (value) {
        this.isNotSelectable = true;
        this.isSetFrequencyHidden = true;
        if (value == 'true' || value == true) {
            this.isSetFrequencyHidden = false;
        }
        else {
            this.isSetFrequencyHidden = true;
        }
        this.scheduleData.recurring_flag = value;
        if (value === 'true') {
            this.multiDateService.dateMode = true;
        }
        else if (value === 'false') {
            this.multiDateService.dateMode = false;
        }
        if (value.length != 0) {
            this.isNotSelectable = false;
        }
    };
    ScheduleComponent.prototype.setMultipleAddressListValues = function () {
        this.scheduleData.multiple_addresses = tslib_1.__spread(this.emails);
    };
    ScheduleComponent.prototype.setCustomValue = function () {
        this.isCollapsed = !this.isCollapsed;
    };
    ScheduleComponent.prototype.setSendingDates = function () {
        // console.log("SETSENDINGDATES() is called in schedule datepicker")
        this.schedulingDates = this.multiDateService.sendingDates;
        // console.log("this.multiDateService.sendingDates ARE:",this.multiDateService.sendingDates)
        if (this.schedulingDates) {
            if (this.schedulingDates.length === 1) {
                this.scheduleData.schedule_for_date = this.multiDateService.sendingDates[0].toString();
            }
            else {
                this.scheduleData.custom_dates = this.multiDateService.sendingDates;
                this.scheduleData.schedule_for_date = "";
            }
            if (this.schedulingDates.length == 1 && this.scheduleData.custom_dates.length) {
                this.scheduleData.custom_dates = [];
            }
        }
    };
    ScheduleComponent.prototype.setCollapse = function (recurrencePattern) {
        if (recurrencePattern === "5") {
            this.isNotSelectable = false;
            this.toasterService.warning("Please select custom dates from the date selector now! Ignore this message if already done!");
            this.setSendingDates();
        }
        else {
            this.isCollapsed = true;
            this.isNotSelectable = false;
        }
    };
    ScheduleComponent.prototype.change = function (value) {
        var _this = this;
        if (value.length) {
            this.datesSelected = value;
            this.dateValue = this.datesSelected[0].month + '/' + this.datesSelected[0].day + '/' + this.datesSelected[0].year;
            this.values = [];
            this.datesSelected.forEach(function (element) {
                if (element.month === undefined) {
                    return;
                }
                _this.values.push((element.month + '/' + element.day + '/' + element.year).toString());
            });
        }
        else {
            this.values = [];
        }
        this.multiDateService.sendingDates = this.values;
    };
    ScheduleComponent.prototype.hideCalendar = function () {
        this.calendarHide = !this.calendarHide;
    };
    ScheduleComponent.prototype.checkingDates = function () {
        var _this = this;
        this.stopSchedule = false;
        if (this.values.length) {
            this.values.forEach(function (date) {
                var d1 = new Date(date);
                _this.minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
                var d2 = _this.minDate.year + "/" + _this.minDate.month + "/" + _this.minDate.day;
                var d3 = new Date(d2);
                var timeDifference = d1.getTime() - d3.getTime();
                var daysDifference = timeDifference / (1000 * 3600 * 24);
                // this.stopSchedule = false;  
                if (daysDifference < 0) {
                    _this.stopSchedule = true;
                    _this.toasterService.error('Please deselect the INVALID date(' + date + ') and continue with dates starting from TODAY to schedule the report!');
                    return;
                }
                else {
                }
            });
        }
    };
    ScheduleComponent.prototype.autoSize = function (el) {
        var element = el;
        setTimeout(function () {
            element.style.cssText = 'height:auto;';
            var height = element.scrollHeight + 5;
            element.style.cssText = 'height:' + height + 'px';
        }, 0);
    };
    ScheduleComponent.prototype.uploadPdf = function (event) {
        var _this = this;
        this.file = event.target.files[0];
        if (this.file) {
            this.fileUpload = true;
        }
        this.fileName = this.file.name;
        var fileValues = {};
        fileValues['file_upload'] = this.pdfFile ? (this.pdfFile.nativeElement.files[0] ? this.pdfFile.nativeElement.files[0] : '') : '';
        this.scheduleService.uploadPdf(fileValues).subscribe(function (res) {
            _this.toasterService.success('Successfully uploaded ', _this.fileName);
            _this.scheduleData.is_file_uploaded = 'true'; // Not needed as true always???
            _this.scheduleData['uploaded_file_name'] = res['uploaded_file_name'];
            _this.scheduleData['ecs_file_object_name'] = res['ecs_file_object_name'];
            _this.scheduleData['ecs_bucket_name'] = res['ecs_bucket_name'];
        }, function (error) {
            _this.toasterService.error("File upload error");
            _this.scheduleData.is_file_uploaded = 'false';
        });
    };
    ScheduleComponent.prototype.select = function (signatureName) {
        var _this = this;
        this.signSelected = true;
        // console.log("CROSS CHECK HTML VALUE:",this.scheduleData.signature_html)
        // console.log("ALL SIGNATURES",this.signatures)
        var selectedSign = this.signatures.find(function (x) {
            return x.signature_name.trim().toLowerCase() == signatureName.trim().toLowerCase();
        });
        this.editorData = selectedSign.signature_html;
        // console.log("Editor data",this.editorData);
        this.selected_id = selectedSign.signature_id;
        // console.log("SELECTED ID data",this.selected_id);
        this.signatures.filter(function (i) {
            if (i['signature_id'] === _this.selected_id) {
                _this.scheduleData.signature_html = i.signature_html;
            }
        });
    };
    ScheduleComponent.prototype.getRecipientList = function () {
        var _this = this;
        this.createReportLayoutService.getRequestDetails(this.scheduleData.request_id).subscribe(function (res) {
            if (res) {
                // this.emails.push(res['user_data']['email']);
                _this.loading = false;
                if (res['dl_list'].length) {
                    var selectedEmails = res['dl_list'].map(function (i) { return i.distribution_list; });
                    _this.emails = selectedEmails;
                    _this.scheduleData.multiple_addresses = _this.emails;
                }
                else {
                    // if empty response
                    _this.emails = [];
                    _this.scheduleData.multiple_addresses = [];
                    _this.loading = false;
                }
                // console.log("Curated Emails:",this.emails);
            }
            else {
                // if no response
                _this.emails = [];
                _this.scheduleData.multiple_addresses = [];
                _this.loading = false;
            }
        });
    };
    ScheduleComponent.prototype.signDeleted = function (event) {
        this.fetchSignatures().then(function (result) {
            Utils.hideSpinner();
        });
    };
    ScheduleComponent.prototype.add = function (event) {
        var input = this.fruitCtrl.value;
        var value = event.value;
        this.getDuplicateMessage(input);
        if ((value || '').trim() && !this.fruitCtrl.invalid && !this.isDuplicate) {
            this.emails.push(value.trim());
        }
        else {
        }
        this.fruitCtrl.setValue('');
        this.scheduleData.multiple_addresses = tslib_1.__spread(this.emails);
    };
    ScheduleComponent.prototype.onSelectionChanged = function (data) {
        this.getDuplicateMessage(data.option.value);
        if (data.option.value && !this.isDuplicate) {
            this.emails.push(data.option.value);
        }
        this.fruitCtrl.setValue('');
    };
    ScheduleComponent.prototype.getDuplicateMessage = function (data) {
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
    ;
    ScheduleComponent.prototype.remove = function (email) {
        var index = this.emails.indexOf(email);
        if (index >= 0) {
            this.emails.splice(index, 1);
        }
        this.scheduleData.multiple_addresses = tslib_1.__spread(this.emails);
    };
    ScheduleComponent.prototype.reset = function () {
        if (this.pdfFile) {
            this.pdfFile['nativeElement']['value'] = "";
        }
        this.fileUpload = false;
    };
    ScheduleComponent.prototype.triggerFileBtn = function () {
        document.getElementById("valueInput").click();
    };
    ScheduleComponent.prototype.fetchSignatures = function (callback) {
        var _this = this;
        if (callback === void 0) { callback = null; }
        return new Promise(function (resolve, reject) {
            var user_id = _this.userId;
            _this.shareReportService.getSignatures(user_id).subscribe(function (res) {
                _this.maxSignId = Math.max.apply(null, res.data.map(function (sign) { return sign.signature_id; })) + 1;
                _this.signatures = tslib_1.__spread([{
                        "signature_id": _this.maxSignId,
                        "signature_name": "Create new signature",
                        "signature_html": "",
                        "user_id": 'USER1',
                        "image_id": null
                    }], res['data']);
                for (var i = 0; i < _this.signatures.length; ++i) {
                    _this.signNames[i] = _this.signatures[i]["signature_name"];
                }
                resolve(true);
            }, function (error) {
                reject(error);
            });
        });
    };
    ScheduleComponent.prototype.updateSignatureData = function (options) {
        Utils.showSpinner();
        // this.shareReportService.putSign(options).subscribe(
        //   res => {
        //     this.toasterService.success("Edited successfully")
        //     this.fetchSignatures().then((result) => {
        //       // this.scheduleData.signature_html = null;   CHECK REFLECTION of signature back again in signature
        //       Utils.hideSpinner();
        //       $('#signature').modal('hide');
        //     }).catch(err => {
        //       this.toasterService.error(err.message || this.defaultError);
        //       Utils.hideSpinner();
        //     })
        //   }, error => {
        //     Utils.hideSpinner();
        //     $('#signature').modal('hide');
        //   })
    };
    ;
    ScheduleComponent.prototype.createSignatureData = function (options) {
        Utils.showSpinner();
        // this.shareReportService.createSign(options).subscribe(
        //   res => {
        //     this.toasterService.success("Created successfully")
        //     this.fetchSignatures().then((result) => {
        //       this.scheduleData.signature_html = null;
        //       Utils.hideSpinner();
        //       $('#signature').modal('hide');
        //     }).catch(err => {
        //       this.toasterService.error(err.message || this.defaultError);
        //       Utils.hideSpinner();
        //     })
        //   }, error => {
        //     Utils.hideSpinner();
        //     $('#signature').modal('hide');
        //   })
    };
    ;
    ScheduleComponent.prototype.addTags = function () {
        if (this.multipleAddresses.trim() == '') {
            this.toasterService.info("Cannot save empty tags");
        }
        else {
            this.scheduleData.multiple_addresses.push(this.multipleAddresses);
            this.multipleAddresses = '';
        }
    };
    ScheduleComponent.prototype.removeTags = function (index) {
        this.statusCheck = true;
        this.exportTags.splice(index, 1);
    };
    ScheduleComponent.prototype.removeNewTags = function (index) {
        this.scheduleData.multiple_addresses.splice(index, 1);
    };
    ScheduleComponent.prototype.checkEmptyField = function () {
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
            (this.scheduleData.ftp_address.length === 0 || this.scheduleData.ftp_password.length === 0 ||
                this.scheduleData.ftp_port.length === 0 || this.scheduleData.ftp_user_name.length === 0)) {
            this.toasterService.error('Please enter FTP details properly to schedule the report!');
            this.isEmptyFields = true;
        }
        else if (this.scheduleData.description.length === 0) {
            this.toasterService.error('Please provide valid description to schedule the report!');
            this.isEmptyFields = true;
        }
        else if (this.scheduleData.signature_html.length === 0) {
            this.toasterService.error('Please select a valid signature to schedule the report!');
            this.isEmptyFields = true;
        }
    };
    ScheduleComponent.prototype.transformDescription = function () {
        var descriptionValue = document.getElementById("description");
        this.description = descriptionValue.innerHTML;
        // console.log("this.description VALUE : ",this.description);
        // this.scheduleData.description = this.description;  CAPTURING THIS VALUE DURING SUBMISSION
    };
    ScheduleComponent.prototype.refreshScheduleData = function () {
        var previousReportName = this.scheduleData.report_name;
        var previousRequestId = this.scheduleData.request_id;
        var previousReportId = this.scheduleData.report_list_id;
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
            ftp_password: '',
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
        // }
        this.scheduleData.report_name = previousReportName;
        this.scheduleData.request_id = previousRequestId;
        this.scheduleData.report_list_id = previousReportId;
        this.calendarHide = true;
        this.showRadio = false;
        this.showNotification = false;
        this.values = [];
        this.emails = [];
        this.isFtpHidden = true;
        document.getElementById("description").innerHTML = '';
        document.getElementById("email").innerHTML = '';
        this.fruitCtrl.setValue('');
        document.getElementById("scheduleTime").innerHTML = '';
        this.file = null;
        this.fileUpload = false;
        this.recurringButtonValue = false;
        // time if not completely
        // date selction not going
        // NO- recurring flag and notification flag
    };
    tslib_1.__decorate([
        ViewChild('pdf'),
        tslib_1.__metadata("design:type", ElementRef)
    ], ScheduleComponent.prototype, "pdfFile", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ScheduleComponent.prototype, "reportId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ScheduleComponent.prototype, "reportName", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], ScheduleComponent.prototype, "scheduleChanges", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ScheduleComponent.prototype, "selectedReqId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ScheduleComponent.prototype, "requestReport", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ScheduleComponent.prototype, "scheduleReportData", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ScheduleComponent.prototype, "update", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ScheduleComponent.prototype, "dateMode", void 0);
    ScheduleComponent = tslib_1.__decorate([
        Component({
            selector: 'app-schedule',
            templateUrl: './schedule.component.html',
            styleUrls: ['./schedule.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [ScheduleService,
            MultiDateService,
            ToastrService,
            Router,
            AuthenticationService,
            ShareReportService,
            CreateReportLayoutService,
            SemanticReportsService])
    ], ScheduleComponent);
    return ScheduleComponent;
}());
export { ScheduleComponent };
//# sourceMappingURL=schedule.component.js.map