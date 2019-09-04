import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { ToastrService } from "ngx-toastr";
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from "src/app/authentication.service";
declare var $: any;

@Component({
  selector: 'app-rmp-landing-page',
  templateUrl: './rmp-landing-page.component.html',
  styleUrls: ['./rmp-landing-page.component.css']
})
export class RmpLandingPageComponent implements OnInit {


  content;
  info;
  notes_details = {
    "notes_content": "",
    "notes_start_date": "",
    "notes_end_date": "",
    "admin_flag": false
  }

  notes = "";
  startTime = { hour: 0, minute: 0 };
  endTime = { hour: 23, minute: 59 };
  startMeridian = true;
  endMeridian = true;
  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  dateCheck: Date;
  admin_notes: any;
  note_status: boolean;
  user_role: string;
  title = 'date-picker';
  naming: any;
  db_end_date: any;
  db_start_date: any;
  showButton: boolean;
  disp_missing_notes = false;
  disp_missing_start_date = false;
  disp_missing_end_date = false;
  disclaimer_encounter_flag = 0;
  customizedToDate: any;
  customizedFromDate: any;

  notification_list: any = null;
  user_name: string;
  notification_set: Set<number>;
  notification_number: number;
  constructor(private django: DjangoService, private DatePipe: DatePipe, calendar: NgbCalendar, private report_id_service: GeneratedReportService,
    private dataProvider: DataProviderService, private auth_service: AuthenticationService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
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

    this.dataProvider.currentlookUpTableData.subscribe(element => {

      if (element) {
        this.info = element
        this.disclaimer_encounter_flag += 1
        if (this.disclaimer_encounter_flag == 1) {
          this.getAdminNotes();

          if (this.info.data.admin_note[0]) {
            this.db_start_date = this.info.data.admin_note[0].notes_start_date;
          }
          let offset = new Date().getTimezoneOffset();
          let startDate = new Date(this.db_start_date);
          let startdatewithoutoffset = startDate.setMinutes(startDate.getMinutes() + offset)
        }
      }
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.report_id_service.buttonStatus.subscribe(showButton => this.showButton = showButton)
    })
  }

  editing() {
    document.getElementById("edit").setAttribute('contenteditable', "true");
    document.getElementById("saving").style.display = "block";
  }

  saving_content() {
    document.getElementById("edit").setAttribute('contenteditable', "false");
    document.getElementById("saving").style.display = "none";
  }

  addDocument() {
    if ($("#display-notes-status").prop("checked") === true) {
      this.notes_details["admin_note_status"] = false;
    }
    else
      this.notes_details["admin_note_status"] = true;
    let notes_content = ((<HTMLInputElement>document.getElementById('notes_content')).value).toString();
    let notes_start_date = ((<HTMLInputElement>document.getElementById('notes_start_date')).value);
    let notes_end_date = ((<HTMLInputElement>document.getElementById('notes_end_date')).value);
    if (notes_content === "" || notes_start_date === "--" || notes_end_date === "--") {
      if (notes_content === "") {
        this.disp_missing_notes = true;
      }
      else if (notes_start_date === "--") {
        this.disp_missing_start_date = true;
      }
      if (notes_end_date === "--") {
        this.disp_missing_end_date = true;
      }
    }
    else {
      let notes_start_timestamp = this.DatePipe.transform(new Date(notes_start_date.toString() + " " + (this.startTime['hour']).toString() + ":" + (this.startTime['minute']).toString()), 'yyyy-MM-dd HH:mm');
      let notes_end_timestamp = this.DatePipe.transform(new Date(notes_end_date.toString() + " " + (this.endTime['hour']).toString() + ":" + (this.endTime['minute']).toString()), 'yyyy-MM-dd HH:mm');
      this.spinner.show()
      this.disp_missing_notes = false;
      this.disp_missing_start_date = false;
      this.disp_missing_end_date = false;
      this.notes_details["notes_content"] = notes_content;
      this.notes_details["notes_start_date"] = notes_start_timestamp;
      this.notes_details["notes_end_date"] = notes_end_timestamp;

      this.django.ddm_rmp_admin_notes(this.notes_details).subscribe(response => {
        $('#AdminNotesModal').modal('hide');
        $('.modal-backdrop').removeClass('modal-backdrop');
        this.spinner.hide();
        this.toastr.success("Admin Notes updated successfully", "Success:")
      }, err => {
        this.spinner.hide()
        this.toastr.error("Selection is incomplete", "Error:")
      }
      );
    }
  }

  clearMessage() {
    $("#notes_content").val('');
  }

  prevMessage() {
    this.spinner.show();
    this.django.get_admin_notes().subscribe(response => {
      this.notes = response["admin_notes"]
      this.spinner.hide();
    })
  }

  getAdminNotes() {
    let today = new Date();
    let today1 = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
    this.changeStartDateFormat();
    this.changeEndDateFormat();
    if (this.info.data.admin_note[0]) {
      this.db_start_date = this.info.data.admin_note[0].notes_start_date;
    }
    //let offset = new Date().getTimezoneOffset();
    let startDate = new Date(this.db_start_date);
    if (this.info.data.admin_note[0]) {
      this.db_end_date = this.info.data.admin_note[0].notes_end_date;
    }
    let endDate = new Date(this.db_end_date);
    if (this.info.data.admin_note[0]) {
      this.admin_notes = this.info.data.admin_note[0].notes_content;
    }

    if (this.info.data.admin_note[0]) {
      this.note_status = this.info.data.admin_note[0].admin_note_status;
    }
    if (this.note_status === true && today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime()) {
      $('#DisplayNotesModal').modal('show');
    }
    if (this.note_status === false)
      $('#display-notes-status').prop("checked", true);
  }

  /*------------------------Calendar---------------------------*/
  changeStartDateFormat() {
    this.customizedFromDate = this.DatePipe.transform(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "dd-MMM-yyyy")
  }
  changeEndDateFormat() {
    this.customizedToDate = this.DatePipe.transform(new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day), "dd-MMM-yyyy")
  }
  onDateSelection(date: NgbDate) {
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

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }


}
