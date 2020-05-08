import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { AuthenticationService } from "src/app/authentication.service";
import Utils from '../../../utils';
declare var $: any;
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DisplayNotesComponent } from '../admin-notes/display-notes/display-notes.component';
import { NotesWrapperComponent } from '../admin-notes/notes-wrapper/notes-wrapper.component';


@Component({
  selector: 'app-rmp-landing-page',
  templateUrl: './rmp-landing-page.component.html',
  styleUrls: ['./rmp-landing-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RmpLandingPageComponent implements OnInit{
  
  public info;
  public notes = [];
  public dateCheck: Date;
  public admin_notes: any = '';
  public note_status: boolean;
  public user_role: string;
  public naming: any;
  public db_end_date: any;
  public db_start_date: any;
  public showButton: boolean;
  public disclaimer_encounter_flag = 0;
  public user_name: string;

  constructor(
    public django: DjangoService,
    private report_id_service: GeneratedReportService,
    public dataProvider: DataProviderService, 
    public  auth_service: AuthenticationService, 
    private toastr: NgToasterComponent,
    private dialog: MatDialog) {
  }
  
  public ngOnInit() { 
    this.getHeaderDetails();
    this.getCurrentLookUpTable();
    this.report_id_service.buttonStatus.subscribe(showButton => this.showButton = showButton);
  }

  // to get the important notes of admin
  public getAdminNotes() {
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
      if(today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime())
          this.dialog.open(DisplayNotesComponent,{
            // width : '135vh',
            // height : '75vh',
            data : { notes : adminNotes.notes_content }
          })
          // $('#DisplayNotesModal').modal('show');
    } else 
    $('#display-notes-status').prop("checked", true);
  }

  // to get full data of rmp landing page
  public getCurrentLookUpTable() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.info = element;
        this.disclaimer_encounter_flag += 1;
        if (this.disclaimer_encounter_flag == 1) {
          this.getAdminNotes();
        }
      }
    })
  }

  openNotesModal(){
    this.dialog.open(NotesWrapperComponent,{
      data : this.info.data.admin_note
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

  // reset important parameters
  public closeNotes() {
    if (this.info.data.admin_note[0]) {
        this.db_start_date = this.info.data.admin_note[0].notes_start_date;
        this.db_end_date = this.info.data.admin_note[0].notes_end_date;
        this.admin_notes = this.info.data.admin_note[0].notes_content;
        this.note_status = this.info.data.admin_note[0].admin_note_status;
    }
  }  

}