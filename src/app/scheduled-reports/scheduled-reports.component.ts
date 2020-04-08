import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, ViewChild } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { NgToasterComponent } from '../custom-directives/ng-toaster/ng-toaster.component'
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

  public dataSource;
  public rarList: any;
  public allUserList = [];
  public allSemanticList = [];
  public displayedColumns = ['index_number', 'report_name', 'schedule_details', 'created_by_user', 'updated_at', 'export_format', 'sharing_mode', 'multiple_addresses', 'more_option'];
  public show: boolean = false;
  public scheduledReportsList: any;
  public isEmptyTables: boolean;
  public defaultError = "There seems to be an error. Please try again later.";
  public scheduleReportId: number;
  public scheduleDataToBeSent: any = {};
  public isLoading: boolean;
  public semanticLayerId: number;
  public firstClick: boolean = false;

  constructor(private scheduleService: ScheduleService,
    private toasterService: NgToasterComponent,
    public router: Router,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.getSemanticId();
    this.tableSorting();
    this.isLoading = true;
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  public tableSorting() {

    this.scheduleService.getScheduledReports(this.semanticLayerId).subscribe(res => {
      this.dataSource = res['data'];

      if (typeof (this.dataSource) == 'undefined' || this.dataSource.length == 0) {
        // display error message 
        this.isEmptyTables = true;
      }

      //////////////////////////// filtering the results
      //transforming export_format
      this.dataSource.map(temp => {
        if (temp["export_format"] == 1) { temp["export_format"] = "CSV" }
        else if (temp["export_format"] == 2) { temp["export_format"] = "Excel" }
      });

      //transforming sharing_mode
      this.dataSource.map(temp => {
        if (temp["sharing_mode"] == 1) { temp["sharing_mode"] = "Email" }
        else if (temp["sharing_mode"] == 2) { temp["sharing_mode"] = "FTP" }
        else if (temp["sharing_mode"] == 3) { temp["sharing_mode"] = "ECS" }
        else { temp["sharing_mode"] = "Unknown format" }
      });

      //transforming the last_modified_data
      this.dataSource.map(temp => {
        temp['updated_at'] = temp['updated_at'].substring(0, 10)
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
      this.dataSource.forEach(temp => {
        if (temp['custom_dates'] == null) { temp['schedule_details'] = temp['schedule_for_date'] }
        else { temp['schedule_details'] = temp['custom_dates'] }
      });

      // sorting the whole data according to the latest modified dates
      this.dataSource.sort(function (a, b) {
        let d1 = new Date(a.updated_at);
        let d2 = new Date(b.updated_at);
        if (d1 > d2) { return -1; }
        else if (d1 == d2) { return 0; }
        else { return 1; }
      })

      //adding the sl.nos in the end
      this.dataSource.map((temp, index) => {
        temp['index_number'] = (index + 1);
      })

      this.getSemanticId();
      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;

    }, error => {
      this.toasterService.error(this.defaultError);
      this.isLoading = false;
    });
  }

  // obtaining the semantic layer id
  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticLayerId = element.data["semantic_id"];
      }
    });
  }

  // directing to scheduled report
  public goToScheduledReport(reportName: string) {
    Utils.showSpinner();
    this.firstClick = true;
    let tempData = this.dataSource['data'];
    this.scheduleReportId = tempData.filter(i => i['index_number'] === reportName).map(i => i['report_schedule_id'])[0]
    // for reteieving the data of a specific report
    this.scheduleService.getScheduleReportData(this.scheduleReportId).subscribe(res => {
      this.scheduleService.scheduleReportIdFlag = res['data']['report_schedule_id'] || null;
      this.scheduleDataToBeSent = res['data'];
      Utils.hideSpinner();
      $('#scheduleModal').modal('show');
    }, error => {
      Utils.hideSpinner();
      this.toasterService.error('Scheduled report loading failed');
    });
  }

  public routeBack() {
    this.router.navigate(['semantic/sem-reports/home']);
  }

  // deledting a scheduled report
  public deleteScheduledReport(procuredScheduleReportId: number) {
    Utils.showSpinner();
    this.scheduleService.deleteScheduledReport(procuredScheduleReportId).subscribe(
      res => {
        if (res) {
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
  }

}




