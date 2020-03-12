import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from "src/app/authentication.service";
declare var $: any;
import 'jquery';

@Component({
  selector: 'app-rmp-landing-page',
  templateUrl: './rmp-landing-page.component.html',
  styleUrls: ['./rmp-landing-page.component.css']
})
export class RmpLandingPageComponent implements OnInit{
  
  public content;
  public info;
  public notes_details = {
    "notes_content": "",
    "notes_start_date": "",
    "notes_end_date": "",
    "admin_flag": false
  };
  public notes = [];
  public startTime = { hour: 0, minute: 0 };
  public endTime = { hour: 23, minute: 59 };
  public startMeridian = true;
  public endMeridian = true;
  public hoveredDate: NgbDate;
  public fromDate: NgbDate;
  public toDate: NgbDate;
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
  public customizedToDate: any;
  public customizedFromDate: any;
  public notification_list: any = null;
  public user_name: string;
  public notification_set: Set<number>;
  public notification_number: number;
  public serviceData;
  constructor(
    private django: DjangoService, 
    private DatePipe: DatePipe,
    public calendar: NgbCalendar, 
    private report_id_service: GeneratedReportService,
    private dataProvider: DataProviderService, 
    private auth_service: AuthenticationService, 
    private spinner: NgxSpinnerService, 
    private toastr: NgToasterComponent) {
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit() { 
    this.getHeaderDetails();
    this.getCurrentLookUpTable();
    this.report_id_service.buttonStatus.subscribe(showButton => this.showButton = showButton);
  }

  // adding new important notes 
  public addDocument() {
    this.notes_details["admin_note_status"] = $("#display-notes-status").prop("checked") ? false: true;
    this.disp_missing_notes = (this.admin_notes === "") ? true : false;
    this.disp_missing_start_date = (this.customizedFromDate === "--") ? true: false;
    this.disp_missing_end_date = (this.customizedToDate === "--") ? true : false;
    
    if (!(this.admin_notes === "") || !(this.customizedFromDate === "--")
           || !(this.customizedToDate === "--")) {
        let notes_start_timestamp: any;
        let notes_end_timestamp: any;
        if(this.customizedToDate && this.startTime['hour'] && this.startTime['minute'])      {
           notes_start_timestamp = this.DatePipe.transform(new Date(this.customizedFromDate.toString() + " " +
          (this.startTime['hour']).toString() + ":" + (this.startTime['minute']).toString()), 'yyyy-MM-dd HH:mm');
        }
        if(this.customizedToDate && this.endTime['hour'] && this.endTime['minute']) {
          notes_end_timestamp = this.DatePipe.transform(new Date(this.customizedToDate.toString() + " " + 
                                  (this.endTime['hour']).toString() + ":" + (this.endTime['minute']).toString()), 'yyyy-MM-dd HH:mm');
        }
        this.spinner.show();
        this.notes_details["notes_content"] = this.admin_notes;
        this.notes_details["notes_start_date"] = notes_start_timestamp;
        this.notes_details["notes_end_date"] = notes_end_timestamp;
        this.getDDmRmpAdminNotes();
    }
  }

  // calling api to add new important notes
  getDDmRmpAdminNotes(){
    this.django.ddm_rmp_admin_notes(this.notes_details).subscribe(response => {
      this.serviceData = response;
      $('#AdminNotesModal').modal('hide');
      $('.modal-backdrop').removeClass('modal-backdrop');
      this.spinner.hide();
      this.toastr.success("Admin Notes updated successfully");
    }, err => {
        this.spinner.hide()
        this.toastr.error("Selection is incomplete")
      });
  }

  // to clear the important notes content
  public clearMessage() {
    $("#notes_content").val('');
  }

// to get the list of previous message of important notes
  public prevMessage() {
    this.spinner.show();
    this.django.get_admin_notes().subscribe(response => {
      response['admin_notes'].forEach(item => {
        item.notes_end_date = new Date(new Date(item.notes_end_date)
                                .toLocaleString("en-US",{timeZone:"America/New_York"}));
      });
      this.notes = response['admin_notes'];
      this.spinner.hide();
    })
  }

  // to get the important notes of admin
  public getAdminNotes() {
    this.changeStartDateFormat();
    this.changeEndDateFormat();
    if (this.info.data.admin_note[0])
      this.updateAdminNotesParams(this.info.data.admin_note[0]);
  }

  public updateAdminNotesParams(adminNotes) {

    this.db_start_date = adminNotes.notes_start_date;
    this.db_end_date = adminNotes.notes_end_date;
    this.admin_notes = adminNotes.notes_content;
    this.note_status = adminNotes.admin_note_status;

    let today = new Date();
    let startDate = new Date(this.db_start_date);
    let endDate = new Date(this.db_end_date);

    if (this.note_status) {
      if(today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime())
          $('#DisplayNotesModal').modal('show');
    } else $('#display-notes-status').prop("checked", true);
  }

  /*------------------------Calendar---------------------------*/
  public changeStartDateFormat() {
    this.customizedFromDate = this.DatePipe.transform(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "dd-MMM-yyyy");
  }
  public changeEndDateFormat() {
    this.customizedToDate = this.DatePipe.transform(new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day), "dd-MMM-yyyy");
  }

  // selecting from and to date selection
  public onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
          this.fromDate = date;
          this.changeStartDateFormat();
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
                this.toDate = date;
                this.changeEndDateFormat();
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.changeStartDateFormat();
    }
  }

  // while selecting date in calendar in important notes 
  public isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  public isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  // it's selected date range of important notes display
  public isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  // to get full data of rmp landing page
  public getCurrentLookUpTable() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.info = element
        this.disclaimer_encounter_flag += 1
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
