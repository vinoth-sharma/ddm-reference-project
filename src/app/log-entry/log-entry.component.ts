import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityModalService } from '../security-modal/security-modal.service';
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-log-entry',
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.css']
})
export class LogEntryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  defaultError = "There seems to be an error. Please try again later.";
  logData = {};
  public rolesDataSource: any;
  public semanticDataSource: any;
  public reportsDataSource: any;
  public tablesDataSource: any;
  isEmpty: boolean;
  isLoadingRoles: boolean = true;
  isLoadingReports: boolean = true;
  isLoadingTables: boolean = true;
  isLoadingSemantic: boolean = true;
  public rolesColumns = ['changed_by_user_name', 'changed_for_user_name', 'change_type', 'change_description', 'change_timestamp', 'sl_name'];
  public semanticColumns = ['sl_name', 'change_type', 'change_description', 'change_timestamp'];
  public reportsColumns = ['report_name', 'sl_name', 'change_type', 'change_description', 'change_timestamp'];
  public tablesColumns = ['sl_name', 'change_type', 'change_description', 'new_name', 'change_timestamp'];

  constructor(private semanticModalService: SecurityModalService,
    private toasterService: ToastrService) { }

  ngOnInit() {

    // this.rolesDataSource.paginator = this.paginator;
    // this.reportsDataSource.paginator = this.paginator;
    // this.semanticDataSource.paginator = this.paginator;
    // this.tablesDataSource.paginator = this.paginator;
    this.semanticModalService.getLogData(1).subscribe(res => {
      this.logData = res;
      this.isLoadingRoles = false;
      this.rolesDataSource = this.logData['data'];
      this.rolesDataSource = new MatTableDataSource(this.rolesDataSource);
      this.rolesDataSource.paginator = this.paginator; })
    //   }, error => {
    //     this.toasterService.error(this.defaultError);

    // });
    // };
    // }
  }


  tabChanged(event) {
    if (event.tab.textLabel == "Semantic Layer") {
      this.semanticModalService.getLogData(2).subscribe(res => {
        this.logData = res;
        this.isLoadingSemantic = false;
        this.semanticDataSource = this.logData['data'];
        this.semanticDataSource = new MatTableDataSource(this.semanticDataSource);
        this.semanticDataSource.paginator = this.paginator;
        if (typeof (this.semanticDataSource) == 'undefined' || this.semanticDataSource.length == 0) {
          this.isEmpty = true;
        }
      })
    } else if (event.tab.textLabel == "Reports") {
      this.semanticModalService.getLogData(4).subscribe(res => {
        this.logData = res;
        this.isLoadingReports = false;
        this.reportsDataSource = this.logData['data'];
        this.reportsDataSource = new MatTableDataSource(this.reportsDataSource);
        this.reportsDataSource.paginator = this.paginator;
        if (typeof (this.reportsDataSource) == 'undefined' || this.reportsDataSource.length == 0) {
          this.isEmpty = true;
        }
      })
    } else if (event.tab.textLabel == "Roles and Responsibilities") {
      this.semanticModalService.getLogData(1).subscribe(res => {
        this.logData = res;
        this.isLoadingRoles = false;
        this.rolesDataSource = this.logData['data'];
        this.rolesDataSource = new MatTableDataSource(this.rolesDataSource);
        this.rolesDataSource.paginator = this.paginator;
        if (typeof (this.rolesDataSource) == 'undefined' || this.rolesDataSource.length == 0) {
          this.isEmpty = true;
        }
      })
    } else if (event.tab.textLabel == "Tables and Custom tables") {
      this.semanticModalService.getLogData(3).subscribe(res => {
        this.logData = res;
        this.isLoadingTables = false;
        this.tablesDataSource = this.logData['data'];
        this.tablesDataSource = new MatTableDataSource(this.tablesDataSource);
        this.tablesDataSource.paginator = this.paginator;
        if (typeof (this.tablesDataSource) == 'undefined' || this.tablesDataSource.length == 0) {
          this.isEmpty = true;
        }
      }
      )
    }
  }
}

