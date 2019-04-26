import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ToastrService } from "ngx-toastr";

import { SecurityModalService } from '../security-modal/security-modal.service';
import { ScheduleService } from '../schedule/schedule.service'
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
  public displayedColumns = ['report_name', 'scheduled_for_date', 'export_format', 'sharing_mode', 'multiple_addresses'];
  public show: boolean = false;
  public scheduledReportsList:any;
  public isEmptyTables: boolean;
  public defaultError = "There seems to be an error. Please try again later.";
  public scheduleReportId: number;
  public scheduleDataToBeSent:any = {};
  public isLoading: boolean;

  constructor(private scheduleService:ScheduleService,private user: AuthenticationService, private semanticModalService: SecurityModalService, private toasterService: ToastrService) { }

  ngOnInit() {
    this.tableSorting();
    this.isEmptyTables = false;
  }

  public tableSorting() {
    this.isLoading = true;
    this.scheduleService.getScheduledReports().subscribe(res =>{
      this.dataSource = res['data']
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
    let tempData =this.dataSource['data'];
    this.scheduleReportId = tempData.filter(i => i['report_name'] === reportName).map(i => i['report_schedule_id'])[0]

    this.scheduleService.getScheduleReportData(this.scheduleReportId).subscribe(res=>{
      // console.log("INCOMING RESULTANT DATA OF REPORT",res['data'])
      this.scheduleDataToBeSent = res['data'];
      $('#scheduleModal').modal('show');
    })

  }
}
