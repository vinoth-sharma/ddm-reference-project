import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
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

// Angular Component developed by Vinoth Sharma Veeramani

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

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ManageNotesComponent implements OnInit {
  @Input() existingNote = [];
  constructor(
    public django: DjangoService, 
    private toastr: NgToasterComponent
  ) { }

  admin_note_obj = {
      noteVisible : true,
      displayFromDate :  new FormControl(),
      displayFromTime :  "00:00",
      displayToDate : new FormControl(),
      displayToTime : "00:00",
      noteData : ""
  }

  minFromDate:Date = null;
  
  ngOnInit(){
    // console.log(this.existingNote);
    if(this.existingNote.length){
      let obj = this.existingNote[0];
      obj.notes_start_date = new Date(this.existingNote[0].notes_start_date)
      obj.notes_end_date = new Date(this.existingNote[0].notes_end_date)
      this.updateExistingNoteData(obj);
    }
    this.minFromDate = new Date();
  }

  updateExistingNoteData(data){
    this.admin_note_obj.noteData = data.notes_content;
    this.admin_note_obj.noteVisible = data.admin_note_status;
    this.admin_note_obj.displayFromDate.setValue(moment(data.notes_start_date)) 
    this.admin_note_obj.displayToDate.setValue(moment(data.notes_end_date))
    this.admin_note_obj.displayFromTime = (data.notes_start_date.getHours()).toString().padStart(2,"0") 
                                          + ":" + (data.notes_start_date.getMinutes()).toString().padStart(2,"0");
    this.admin_note_obj.displayToTime = (data.notes_end_date.getHours()).toString().padStart(2,"0")
                                         + ":" + (data.notes_end_date.getMinutes()).toString().padStart(2,"0");
  }

  dateSelectionDone(event:any){
    // CHANGED FOR PROD
    // console.log("EVENT details",event);
  }

  checkNoteFormValid(){
    if(this.admin_note_obj.noteData && this.admin_note_obj.displayFromDate.value 
        && this.admin_note_obj.displayToDate.value){
        this.submitNote();          
        }
    else
      return false
  }

  timeSelected(event,type){
    if(type === "from")
      this.admin_note_obj.displayFromTime = event;
    else
      this.admin_note_obj.displayToTime = event;
  }

  submitNote(){
    Utils.showSpinner();
    let notes_details = {
      notes_content : this.admin_note_obj.noteData ,
      notes_start_date : this.extractDateTime(this.admin_note_obj.displayFromDate.value,this.admin_note_obj.displayFromTime) ,
      notes_end_date : this.extractDateTime(this.admin_note_obj.displayToDate.value,this.admin_note_obj.displayToTime) ,
      admin_note_status : this.admin_note_obj.noteVisible,
      admin_flag : false
    };
    // console.log(notes_details);
    this.django.ddm_rmp_admin_notes(notes_details).subscribe(response => {
      Utils.hideSpinner();
      this.toastr.success("Admin Notes updated successfully");
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Admin note update unsuccessfull")
      });
  }

  extractDateTime(date,time){
    let l_time = time.split(":");
    let l_date = new Date(date.year(),date.month(),date.date(),l_time[0],l_time[1]);
    return l_date
  }

  clearSelection(){
    this.admin_note_obj = {
      noteVisible : true,
      displayFromDate :  new FormControl(),
      displayFromTime :  "00:00",
      displayToDate : new FormControl(),
      displayToTime : "00:00",
      noteData : ""
    }
  }
}
