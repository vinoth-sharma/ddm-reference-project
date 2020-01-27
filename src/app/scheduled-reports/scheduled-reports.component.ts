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
  // public displayedColumns = ['index_number','report_name','schedule_for_date', 'custom_dates', 'created_by_user', 'updated_at', 'export_format', 'sharing_mode', 'multiple_addresses'];
  public displayedColumns = ['index_number', 'report_name', 'schedule_details', 'created_by_user', 'updated_at', 'export_format', 'sharing_mode', 'multiple_addresses', 'more_option'];
  public show: boolean = false;
  public scheduledReportsList:any;
  public isEmptyTables: boolean;
  public defaultError = "There seems to be an error. Please try again later.";
  public scheduleReportId: number;
  public scheduleDataToBeSent:any = {};
  public isLoading: boolean;
  public semanticLayerId: number;
  public firstClick : boolean = false;
  // public confirmText : String = '';
  // public confirmHeader :String = '';
  // public confirmFn : any ;

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

    // //console.log("SCHEDULED REPORTS LIST BEFORE",this.dataSource);
    
    //////////////////////////// filtering the results

    //transforming export_format
    this.dataSource.map( temp => { 
      if( temp["export_format"] == 1){ temp["export_format"] = "CSV" } 
      else  if( temp["export_format"] == 2){ temp["export_format"] = "Excel" }  
    });

    //transforming sharing_mode
    this.dataSource.map( temp => { 
      if( temp["sharing_mode"] == 1){ temp["sharing_mode"] = "Email" } 
      else if( temp["sharing_mode"] == 2){ temp["sharing_mode"] = "FTP" }  
      else if( temp["sharing_mode"] == 3){ temp["sharing_mode"] = "ECS"} 
      else { temp["sharing_mode"] = "Unknown format"} 
    });

    //transforming the last_modified_data
    this.dataSource.map( temp => {
      temp['updated_at'] = temp['updated_at'].substring(0,10)
    })

    //transforming the multiple_addresses
    this.dataSource.forEach(element => {
      element['multiple_addresses'] = element['multiple_addresses'] ?
        element['multiple_addresses'].join(",\n") : element['multiple_addresses'];
      })
 
    //transforming the custom_dates
    this.dataSource.forEach(element => {
      element['custom_dates'] = element['custom_dates'] ?
        element['custom_dates'].join(",\n") : element['custom_dates'];
      })

    // unifying the schedule_details
    this.dataSource.forEach(temp=> {
        if(temp['custom_dates'] == null){ temp['schedule_details'] = temp['schedule_for_date']} 
        else{temp['schedule_details'] = temp['custom_dates']}
      });

    // sorting the whole data according to the latest modified dates
    this.dataSource.sort(function(a,b){
      let d1 = new Date(a.updated_at);
      let d2 = new Date(b.updated_at); 			
      if(d1>d2){return -1;}	
      else if(d1 == d2){return 0;}	
      else{return 1;} 
    })

    //adding the sl.nos in the end
    this.dataSource.map( (temp,index) => {
      temp['index_number'] = (index+1);
    })

    

    // console.log("SCHEDULED REPORTS LIST after processing",this.dataSource);

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
        // //console.log("PROCURED SL_ID",this.semanticLayerId);
      }
    });
  }

  public goToReports(reportName:string){ 
    Utils.showSpinner();
    this.firstClick = true;
    let tempData =this.dataSource['data'];
    // //console.log("tempData VALUE:",tempData)
    this.scheduleReportId = tempData.filter(i => i['index_number'] === reportName).map(i => i['report_schedule_id'])[0]
    // //console.log("this.scheduleReportId VALUE:",this.scheduleReportId)

    // for reteieving the data of a specific report
    this.scheduleService.getScheduleReportData(this.scheduleReportId).subscribe(res=>{
      // //console.log("INCOMING RESULTANT DATA OF REPORT",res['data'])
      this.scheduleService.scheduleReportIdFlag = res['data']['report_schedule_id'] || null;
      this.scheduleDataToBeSent = res['data'];
      Utils.hideSpinner();
      $('#scheduleModal').modal('show');
      
    }, error => {
      Utils.hideSpinner();
      this.toasterService.error('Scheduled report loading failed');
    });

  }

  public routeBack(){
    this.router.navigate(['semantic/sem-reports/home']);
  }

  public deleteScheduledReport(procuredScheduleReportId : number ){
    console.log("Logging the procuredScheduleReportId : ",procuredScheduleReportId);
    Utils.showSpinner();
    this.scheduleService.deleteScheduledReport(procuredScheduleReportId).subscribe(
      res=>{
      if(res){
        this.toasterService.success("Scheduled report deleted successfully");
        this.tableSorting();
        Utils.hideSpinner();
      }
      },
      err => {
        this.toasterService.error(err.message["error"]);
        Utils.hideSpinner();
        Utils.closeModals();
      }
    )
    // use a modal to ask confirmation and then call API
    // $('#confirmationModal').modal('show');   
  }

}




