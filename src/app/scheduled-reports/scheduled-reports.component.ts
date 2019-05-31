import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
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

export class ScheduledReportsComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // public dataSource: any;
  public dataSource;

  public rarList: any;
  public allUserList = [];
  public allSemanticList = [];
  public displayedColumns = ['index_number','report_name','schedule_for_date', 'custom_dates', 'created_by_user', 'updated_at', 'export_format', 'sharing_mode', 'multiple_addresses'];
  public show: boolean = false;
  public scheduledReportsList:any;
  public isEmptyTables: boolean;
  public defaultError = "There seems to be an error. Please try again later.";
  public scheduleReportId: number;
  public scheduleDataToBeSent:any = {};
  public isLoading: boolean;
  public semanticLayerId: number;

  constructor(private scheduleService:ScheduleService,
    private toasterService: ToastrService,
    public router: Router,
    public authenticationService: AuthenticationService) { }

    ngOnInit() {
      this.getSemanticId();
      this.tableSorting();
      this.isLoading = true;
      // this.isEmptyTables = false;
      // this.scheduleData.created_by = this.authenticationService.userId;
    }

    ngAfterViewInit(){
      if( this.dataSource){
      this.dataSource.sort = this.sort;
    }
    }

  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];


  public tableSorting(){
    // Utils.showSpinner();
  this.scheduleService.getScheduledReports(this.semanticLayerId).subscribe(res =>{
    this.dataSource = res['data'];

    if (typeof (this.dataSource) == 'undefined' || this.dataSource.length == 0) {
      // display error message 
      this.isEmptyTables = true;
    }

    // console.log("SCHEDULED REPORTS LIST BEFORE",this.dataSource);
    
    //////////////////////////// filtering the results

    //transforming export_format
    this.dataSource.map( temp => { 
      if( temp["export_format"] == 1){ temp["export_format"] = "CSV" } 
      else  if( temp["export_format"] == 2){ temp["export_format"] = "Excel" }  
      else if( temp["export_format"] == 3){ temp["export_format"] = "Pdf"}  
      else if( temp["export_format"] == 4){ temp["export_format"] = "Text" }  
      else if( temp["export_format"] == 5){ temp["export_format"] = "HTML" }  
      else if( temp["export_format"] == 6){ temp["export_format"] = "XML" }  
    });

    //transforming sharing_mode
    this.dataSource.map( temp => { 
      if( temp["sharing_mode"] == 1){ temp["sharing_mode"] = "Email" } 
      else if( temp["sharing_mode"] == 2){ temp["sharing_mode"] = "Shared Drive" }  
      else if( temp["sharing_mode"] == 3){ temp["sharing_mode"] = "FTP"} 
      else { temp["sharing_mode"] = "Unknown format"} 
    });

    //adding the sl.nos
    this.dataSource.map( (temp,index) => {
      temp['index_number'] = (index+1);
    })

    //transforming the last_nodified_data
    this.dataSource.map( temp => {
      temp['updated_at'] = temp['updated_at'].substring(0,10)
    })

    this.getSemanticId();
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.isLoading = false;

    // Utils.hideSpinner();

  }, error => {
    this.toasterService.error(this.defaultError);
    this.isLoading = false;

    // Utils.hideSpinner();

  });
  // ngOnInit() {
    
  // }
  }


  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticLayerId = element.data["semantic_id"];
        // console.log("PROCURED SL_ID",this.semanticLayerId);
      }
    });
  }

  public goToReports(reportName:string){
    Utils.showSpinner();
    let tempData =this.dataSource['data'];
    // console.log("tempData VALUE:",tempData)
    this.scheduleReportId = tempData.filter(i => i['index_number'] === reportName).map(i => i['report_schedule_id'])[0]
    // console.log("this.scheduleReportId VALUE:",this.scheduleReportId)

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
}




