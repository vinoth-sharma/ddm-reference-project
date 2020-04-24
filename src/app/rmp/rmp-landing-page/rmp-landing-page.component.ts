import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
// import { DatePipe } from '@angular/common';
import { AuthenticationService } from "src/app/authentication.service";
import Utils from '../../../utils';
declare var $: any;
// import 'jquery';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-rmp-landing-page',
  templateUrl: './rmp-landing-page.component.html',
  styleUrls: ['./rmp-landing-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RmpLandingPageComponent implements OnInit {

  public content;
  public info;
  public notes = [];
  public startTime = { hour: 0, minute: 0 };
  public endTime = { hour: 23, minute: 59 };
  public startMeridian = true;
  public endMeridian = true;
  public fromDate: any;
  public toDate: any;
  public dateCheck: Date;
  public admin_notes: any = '';
  public note_status: boolean;
  public user_role: string;
  public title = 'date-picker';
  public naming: any;
  public db_end_date: any;
  public db_start_date: any;
  public showButton: boolean;
  public disp_missing_notes = false;
  public disp_missing_start_date = false;
  public disp_missing_end_date = false;
  public disclaimer_encounter_flag = 0;
  public customizedToDate: any = '';
  public customizedFromDate: any = '';
  public notification_list: any = null;
  public user_name: string;
  public notification_set: Set<number>;
  public notification_number: number;
  public myForm: FormGroup;
  public matcher = new MyErrorStateMatcher();
  public targetStart = "";
  public targetend = "";
  public dateClass;
  public targetStartDate;
  public targetEndDate;
  public targetStartMonth;
  public targetEndMonth;

  constructor(
    public django: DjangoService,
    // private DatePipe: DatePipe,
    private report_id_service: GeneratedReportService,
    public dataProvider: DataProviderService,
    public auth_service: AuthenticationService,
    private toastr: NgToasterComponent,
    private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      'startDate': [''],
      'endDate': ['']
    }, { validator: this.checkDates });

    this.myForm.setValue({
      startDate: this.targetStart,
      endDate: this.targetend
    });
  }

  public checkDates(group: FormGroup) {
    if (group.controls.endDate.value < group.controls.startDate.value) {
      return { endDateLessThanStartDate: true }
    }
    return null;
  }

  public ngOnInit() {
    this.getHeaderDetails();
    this.getCurrentLookUpTable();
    this.report_id_service.buttonStatus.subscribe(showButton => this.showButton = showButton);
  }

  // adding new important notes 
  public addDocument() {
    let notes_details = {
      "notes_content": "",
      "notes_start_date": "",
      "notes_end_date": "",
      "admin_flag": false
    };
    notes_details["admin_note_status"] = $("#display-notes-status").prop("checked") ? false : true;
    this.disp_missing_notes = (this.admin_notes === "") ? true : false;
    this.disp_missing_start_date = (this.customizedFromDate === "") ? true : false;
    this.disp_missing_end_date = (this.customizedToDate === "") ? true : false;

    if (!(this.admin_notes === "") || !(this.customizedFromDate === "")
      || !(this.customizedToDate === "")) {
      let dateObject = new Date();
      if (this.customizedFromDate === (this.dateFormat(dateObject))) {
        notes_details["notes_start_date"] = this.customizedFromDate + ' ' + (dateObject.getHours() + ":" + dateObject.getMinutes());
      }
      else {
        notes_details["notes_start_date"] = this.customizedFromDate + ' ' + '00:00';
      }

      notes_details["notes_end_date"] = this.customizedToDate + ' ' + '23:59';
      notes_details["notes_content"] = this.admin_notes;
      this.getDDmRmpAdminNotes(notes_details);
    }
  }

  // calling api to add new important notes
  public getDDmRmpAdminNotes(notes_details) {
    Utils.showSpinner();
    this.django.ddm_rmp_admin_notes(notes_details).subscribe(response => {
      $('#AdminNotesModal').modal('hide');
      $('.modal-backdrop').removeClass('modal-backdrop');
      Utils.hideSpinner();
      this.toastr.success("Admin Notes updated successfully");
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Selection is incomplete")
    });
  }

  // to clear the important notes content
  public clearMessage() {
    $("#notes_content").val('');
  }

  // to get the list of previous message of important notes
  public prevMessage() {
    Utils.showSpinner();
    this.django.get_admin_notes().subscribe(response => {
      response['admin_notes'].forEach(item => {
        item.notes_end_date = new Date(new Date(item.notes_end_date)
          .toLocaleString("en-US", { timeZone: "America/New_York" }));
      });
      this.notes = response['admin_notes'];
      this.notes.shift();
      console.log("this.notes : ", this.notes);
      Utils.hideSpinner();
    })
  }

  // to get the important notes of admin
  public getAdminNotes() {
    this.customizedFromDate = this.dateFormat(new Date());
    let newDate = new Date();
    this.customizedToDate = this.dateFormat(new Date(newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate() + 10));
    if (this.info.data.admin_note[0])
      this.updateAdminNotesParams(this.info.data.admin_note[0]);
  }

  // update admin notes parameter
  public updateAdminNotesParams(adminNotes) {

    this.db_start_date = adminNotes.notes_start_date;
    this.db_end_date = adminNotes.notes_end_date;
    this.admin_notes = adminNotes.notes_content;
    this.note_status = adminNotes.admin_note_status;

    let today = new Date();
    let startDate = new Date(this.db_start_date);
    let endDate = new Date(this.db_end_date);

    if (this.note_status) {
      if (today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime())
        $('#DisplayNotesModal').modal('show');
    } else
      $('#display-notes-status').prop("checked", true);
  }

  // select from date
  public startDateEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.targetStart = new Date(this.dateFormat(event.value)).toISOString();
    this.customizedFromDate = this.dateFormat(event.value);
    this.targetStartDate = new Date(event.value).getDate();
    this.targetStartMonth = new Date(event.value).getMonth() + 1;
    this.markDates();
  }

  // select to date
  public endDateEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.targetEndDate = new Date(event.value).getDate();
    this.targetend = new Date(this.dateFormat(event.value)).toISOString();
    this.customizedToDate = this.dateFormat(event.value);
    this.targetEndMonth = new Date(event.value).getMonth() + 1;
    this.markDates();
  }

  // heighligth background color dates from fromDate to endDate
  public markDates() {
    if (this.targetStartMonth && this.targetEndMonth) {
      this.dateClass = (d: Date): MatCalendarCellCssClasses => {
        const date = d.getDate();
        const m = d.getMonth() + 1;
        if (m === this.targetStartMonth && m === this.targetEndMonth) {
          if (date > this.targetStartDate && date < this.targetEndDate)
            return 'custom-date-class';
        } else if (m >= this.targetStartMonth && m <= this.targetEndMonth) {
          if (m > this.targetStartMonth && m < this.targetEndMonth)
            return 'custom-date-class';
          else if (m === this.targetStartMonth) {
            if (date > this.targetStartDate)
              return 'custom-date-class';
          } else if (m === this.targetEndMonth) {
            if (date < this.targetEndDate)
              return 'custom-date-class';
          }
        }
      };
    }
  }

  // formating date 
  public dateFormat(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }


  // to get full data of rmp landing page
  public getCurrentLookUpTable() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.info = element;
        this.disclaimer_encounter_flag += 1;
        if (this.disclaimer_encounter_flag == 1) {
          this.getAdminNotes();
          if (this.info.data.admin_note[0])
            this.db_start_date = this.info.data.admin_note[0].notes_start_date;

          let offset = new Date().getTimezoneOffset();
          let startDate = new Date(this.db_start_date);
          let startdatewithoutoffset = startDate.setMinutes(startDate.getMinutes() + offset)
        }
      }
    })
  }

  // to get role and name user details
  public getHeaderDetails() {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
        this.dataProvider.currentNotifications.subscribe((element: Array<any>) => {
          if (element) {
            this.user_name = role["first_name"] + "" + role["last_name"]
            this.user_role = role["role"]
          }
        })
      }
    })
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid);
    const invalidParent = !!(control && control.parent && control.parent.invalid);

    return (invalidCtrl || invalidParent);
  }
}