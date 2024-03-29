import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { DjangoService } from '../../django.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import Utils from '../../../../utils';

const moment = _moment;
const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-manage-notes',
  templateUrl: './manage-notes.component.html',
  styleUrls: ['./manage-notes.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ManageNotesComponent implements OnInit {
  @Input() existingNote = [];
  constructor(
    public django: DjangoService,
    private toastr: NgToasterComponent
  ) { }

  admin_note_obj = {
    noteVisible: true,
    displayFromDate: new FormControl(),
    displayFromTime: "00:00",
    displayToDate: new FormControl(),
    displayToTime: "00:00",
    noteData: ""
  }

  minFromDate: Date = null;
  minToDate: Date = null;
  @Output() closeParentWraper = new EventEmitter()


  ngOnInit() {
  }

  ngOnChanges(){
    this.minFromDate = new Date();
    if (this.existingNote.length) {
      let obj = this.existingNote[0];
      obj.notes_start_date = new Date(this.existingNote[0].notes_start_date)
      obj.notes_end_date = new Date(this.existingNote[0].notes_end_date)
      this.updateExistingNoteData(obj);
    }
  }

  updateExistingNoteData(data) {
    this.admin_note_obj.noteData = data.notes_content;
    this.admin_note_obj.noteVisible = data.admin_note_status;
    this.admin_note_obj.displayFromDate.setValue(moment(data.notes_start_date))
    this.admin_note_obj.displayToDate.setValue(moment(data.notes_end_date))
    this.admin_note_obj.displayFromTime = (data.notes_start_date.getHours()).toString().padStart(2, "0")
      + ":" + (data.notes_start_date.getMinutes()).toString().padStart(2, "0");
    this.admin_note_obj.displayToTime = (data.notes_end_date.getHours()).toString().padStart(2, "0")
      + ":" + (data.notes_end_date.getMinutes()).toString().padStart(2, "0");
  }

  dateSelectionDone(event: any, type) {
    if (type === "from") {
      let l_from = this.admin_note_obj.displayFromDate.value;
      let l_to = this.admin_note_obj.displayToDate.value;
      if (+new Date(l_from.toISOString()) > +new Date(l_to.toISOString())) {
        this.admin_note_obj.displayToDate.setValue(l_from)
      }
      this.minToDate = new Date(l_from.toISOString());
    }
  }

  checkNoteFormValid() {
    if (this.admin_note_obj.noteData && this.admin_note_obj.displayFromDate.value
      && this.admin_note_obj.displayToDate.value) {
      this.submitNote();
    }
    else
      this.toastr.error("Please fill in all the mandatory fields");
    return false
  }

  timeSelected(event, type) {
    if (type === "from")
      this.admin_note_obj.displayFromTime = event;
    else
      this.admin_note_obj.displayToTime = event;
  }

  submitNote() {
    Utils.showSpinner();
    let notes_details = {
      notes_content: this.admin_note_obj.noteData,
      notes_start_date: this.extractDateTime(this.admin_note_obj.displayFromDate.value, this.admin_note_obj.displayFromTime),
      notes_end_date: this.extractDateTime(this.admin_note_obj.displayToDate.value, this.admin_note_obj.displayToTime),
      admin_note_status: this.admin_note_obj.noteVisible,
      admin_flag: false
    };
    this.django.ddm_rmp_admin_notes(notes_details).subscribe(response => {
      Utils.hideSpinner();
      this.toastr.success("Admin Notes updated successfully");
      this.closeParentWraper.emit();
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Admin note not updated");
    });
  }

  extractDateTime(date, time) {
    let l_time = time.split(":");
    let l_date = new Date(date.year(), date.month(), date.date(), l_time[0], l_time[1]);
    return l_date
  }

  clearSelection() {
    this.admin_note_obj = {
      noteVisible: true,
      displayFromDate: new FormControl(),
      displayFromTime: "00:00",
      displayToDate: new FormControl(),
      displayToTime: "00:00",
      noteData: ""
    }
  }
}
