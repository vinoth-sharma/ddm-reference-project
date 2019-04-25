import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { ToastrService } from "ngx-toastr";
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import $ from 'jquery';
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
    "ddm_rmp_admin_notes_id" : 1,
    "notes_content" : "",
    "notes_start_date" : "",
    "notes_end_date" : "",
    "admin_flag" : false
  }

  // validationObject = {
  //   isNotesFilled: false,
  //   isStartDateSelected: false,
  //   isEndDateSelected: false,
  // }
  

  hoveredDate: NgbDate;
   

  fromDate: NgbDate;
  toDate: NgbDate;
  // dateCheck = new Date();
  dateCheck: Date;
  admin_notes: any;

   

  title = 'date-picker';
  naming: any;
  db_end_date: any;
  db_start_date: any;
  showButton: boolean;
  disp_missing_notes = false;
  disp_missing_start_date = false;
  disp_missing_end_date = false;
  constructor(private django : DjangoService, private DatePipe: DatePipe, calendar: NgbCalendar, private report_id_service: GeneratedReportService,
    dataProvider : DataProviderService,private toastr : ToastrService,private formBuilder: FormBuilder) {
    this.fromDate = calendar.getToday();
    //this.dateCheck =  calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.info = dataProvider.getLookupTableData()
    
  }

  ngOnInit() {
    this.getAdminNotes();
    setTimeout(() => {
    this.report_id_service.buttonStatus.subscribe(showButton => this.showButton = showButton)
    // console.log(this.showButton)
    // this.form = this.formBuilder.group({
    //     notes_content: [null, [Validators.required]],
    //     notes_start_date: [null, Validators.required],
    //     notes_end_date: [null, Validators.required]
    //   });
    })
  }

  editing(){
    document.getElementById("edit").setAttribute('contenteditable', "true");
    document.getElementById("saving").style.display = "block";
  }
    
  saving_content(){
    document.getElementById("edit").setAttribute('contenteditable',"false");
    document.getElementById("saving").style.display = "none";
  } 

    addDocument(){
      // for(let property in this.validationObject) {
      //   if(this.validationObject[property] === false) {
      //     return
      //   }
      // }
      //console.log(this.validationObject)
      let notes_content = ((<HTMLInputElement>document.getElementById('notes_content')).value).toString();
       console.log(notes_content);
      //let notes_start_date = ((<HTMLInputElement>document.getElementById('notes_start_date')).value).toString();
      let notes_start_date = this.DatePipe.transform(((<HTMLInputElement>document.getElementById('notes_start_date')).value), 'yyyy-MM-dd');
      console.log(notes_start_date);
      //let notes_end_date = ((<HTMLInputElement>document.getElementById('notes_end_date')).value).toString();
      let notes_end_date = this.DatePipe.transform(((<HTMLInputElement>document.getElementById('notes_end_date')).value), 'yyyy-MM-dd');
       console.log(notes_end_date);

      if (notes_content === "" || notes_start_date === null || notes_end_date === null)
       { 
         console.log('IF')
        if(notes_content==="") {
          this.disp_missing_notes=true;
          console.log(this.disp_missing_notes)
          }
        else if(notes_start_date===null){
          this.disp_missing_start_date=true;
          console.log(this.disp_missing_start_date)
        }
        if(notes_end_date===null){
          this.disp_missing_end_date=true;
          console.log(this.disp_missing_end_date)
        }
       }
      // if(notes_content!=""){
      // this.admin_notes=notes_content;
      // }
       else{  
        console.log('Else')
        this.disp_missing_notes=false;
        this.disp_missing_start_date=false;
        this.disp_missing_end_date=false;
        console.log(this.disp_missing_notes);
        console.log(this.disp_missing_start_date);
        console.log(this.disp_missing_end_date);
        this.notes_details["notes_content"] = notes_content;
        this.notes_details["notes_start_date"] = notes_start_date;
        this.notes_details["notes_end_date"] = notes_end_date;
        
        this.django.ddm_rmp_admin_notes(this.notes_details).subscribe(response =>{
          console.log($('#AdminNotesModal'));
          $('#AdminNotesModal').modal('hide');
          $('.modal-backdrop').removeClass('modal-backdrop');
        this.toastr.success("Admin Notes updated successfully","Success:")
        },err =>{
          this.toastr.error("Selection is incomplete","Error:")
        }
        );
      // this.naming.push(this.notes_details);
       // this.getAdminNotes();
       }
    }

    getAdminNotes(){
      
        // console.log(info)
        let today=new Date();
        this.db_start_date = this.info.data.admin_note.notes_start_date;
        let startDate=new Date(this.db_start_date);
        this.db_end_date = this.info.data.admin_note.notes_end_date;
        let endDate=new Date(this.db_end_date);
        this.admin_notes = this.info.data.admin_note.notes_content;
        // console.log("Notes :: "+this.admin_notes);

        if(today>=startDate && today<=endDate){
          $('#DisplayNotesModal').modal('show');
          // console.log("Valid");
        //document.getElementById("modal_load_button").click();
        }else{
          // console.log("Not Valid");
        }
      
    }

      /*------------------------Calendar---------------------------*/
    onDateSelection(date: NgbDate) {
      console.log('Hovered date')
      console.log(this.hoveredDate)
      if (!this.fromDate && !this.toDate) {
       // this.validationObject['isStartDateSelected'] = true
        this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
       // this.validationObject['isEndDateSelected'] = true
        this.toDate = date;
      } else {
        console.log(date)
       // this.validationObject['isStartDateSelected'] = true
       // this.validationObject['isEndDateSelected'] = false
        this.toDate = null;
        this.fromDate = date;
      }
      //console.log(this.validationObject)
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
