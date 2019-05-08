import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';

import { ScheduleService } from '../schedule/schedule.service'
import Utils from 'src/utils';
declare var $: any;

@Component({
  selector: 'app-scheduled-reports',
  templateUrl: './scheduled-reports.component.html',
  styleUrls: ['./scheduled-reports.component.css']
})

export class ScheduledReportsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  public dataSource: any;
  public rarList: any;
  public allUserList = [];
  public allSemanticList = [];
  public displayedColumns = ['report_name', 'custom_dates', 'created_by_user', 'schedule_for_date', 'export_format', 'sharing_mode', 'multiple_addresses'];
  public show: boolean = false;
  public scheduledReportsList:any;
  public isEmptyTables: boolean;
  public defaultError = "There seems to be an error. Please try again later.";
  public scheduleReportId: number;
  public scheduleDataToBeSent:any = {};
  public isLoading: boolean;
  public semanticLayerId: number;
  // public scheduleReportIdFlag: number;

  constructor(private scheduleService:ScheduleService,
              private toasterService: ToastrService,
              public router: Router,
              public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.getSemanticId();
    this.tableSorting();
    this.isEmptyTables = false;
    // this.scheduleData.created_by = this.authenticationService.userId;
  }

  // public sharingModes = [
  //   {'value': 1, 'display': 'Email'},
  //   {'value': 2, 'display': 'Shared Drive'},
  //   {'value': 3, 'display': 'FTP'},
  // ]

  public tableSorting() {
    this.isLoading = true;
    // for loading data to display(whole)
    this.scheduleService.getScheduledReports(this.semanticLayerId).subscribe(res =>{
      this.dataSource = res['data']
      // console.log("SCHEDULED REPORTS LIST BEFORE",this.dataSource);
      
      // filtering the result
      //transforming export_format
      this.dataSource.map( temp => { 
        if( temp["export_format"] == 1){ temp["export_format"] = "CSV" } 
        else  if( temp["export_format"] == 2){ temp["export_format"] = "Excel" }  
        else if( temp["export_format"] == 3){ temp["export_format"] = "Pdf"}  
        else if( temp["export_format"] == 4){ temp["export_format"] = "Text" }  
        else if( temp["export_format"] == 5){ temp["export_format"] = "HTML" }  
        else if( temp["export_format"] == 6){ temp["export_format"] = "XML" }  
        // temp["export_format"]  =  this.sharingModes[temp["export_format"]].display;
      });

      //transforming sharing_mode
      this.dataSource.map( temp => { 
        if( temp["sharing_mode"] == 1){ temp["sharing_mode"] = "Email" } 
        else if( temp["sharing_mode"] == 2){ temp["sharing_mode"] = "Shared Drive" }  
        else if( temp["sharing_mode"] == 3){ temp["sharing_mode"] = "FTP"} 
        else { temp["sharing_mode"] = "Unknown format"} 
      });

      // console.log("modified SCHEDULED REPORTS LIST",this.dataSource);

      if (typeof (this.dataSource) == 'undefined' || this.dataSource.length == 0) {  
        this.isEmptyTables = true;
      }


      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    }, error => {
      this.toasterService.error(this.defaultError);
      this.isLoading = false;
    });
  };


  public goToReports(reportName:string){
    Utils.showSpinner();
    let tempData =this.dataSource['data'];
    this.scheduleReportId = tempData.filter(i => i['report_name'] === reportName).map(i => i['report_schedule_id'])[0]

    // for reteieving the data of a specific report
    this.scheduleService.getScheduleReportData(this.scheduleReportId).subscribe(res=>{
      // console.log("INCOMING RESULTANT DATA OF REPORT",res['data'])
      this.scheduleService.scheduleReportIdFlag = res['data']['report_schedule_id'] || null;
      this.scheduleDataToBeSent = res['data'];
      Utils.hideSpinner();
      $('#scheduleModal').modal('show');
      
    }, error => {
      Utils.hideSpinner();
      this.toasterService.error('Scheduled report loading failed');
    });

  }

  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticLayerId = element.data["semantic_id"];
        // console.log("PROCURED SL_ID",this.semanticLayerId);
      }
    });
  }
}
