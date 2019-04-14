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
  isLoading : boolean;
  public rolesColumns = ['changed_by_user_name', 'changed_for_user_name', 'change_type', 'change_description', 'change_timestamp', 'sl_name'];
  public semanticColumns = ['sl_name', 'change_type', 'change_description', 'change_timestamp'];
  public reportsColumns = ['report_name', 'sl_name', 'change_type', 'change_description', 'change_timestamp'];
  public tablesColumns = ['sl_name', 'change_type', 'change_description', 'new_name', 'change_timestamp'];

  constructor(private semanticModalService: SecurityModalService,
    private toasterService: ToastrService) { }

  ngOnInit() {

    this.semanticModalService.getLogData(1).subscribe(res => {
      this.logData = res;
      this.isLoading = false;
      console.log("data", this.logData)
      this.rolesDataSource = this.logData['data'];
      console.log(this.rolesDataSource);
      if (typeof (this.rolesDataSource) == 'undefined' || this.rolesDataSource.length == 0) {
        this.isEmpty = true;
      }
      this.rolesDataSource = new MatTableDataSource(this.rolesDataSource);
      this.rolesDataSource.paginator = this.paginator;
    })
    //   }, error => {
    //     this.toasterService.error(this.defaultError);

    // });
    // };
    // }
  }


  tabChanged(event) {
    if (event.tab.textLabel == "Semantic Layer") {
      console.log('Clicked: ' + event.tab.textLabel);
      this.semanticModalService.getLogData(2).subscribe(res => {
        this.logData = res;
        console.log("data", this.logData)
        this.semanticDataSource = this.logData['data'];
        console.log(this.semanticDataSource);
        this.semanticDataSource = new MatTableDataSource(this.semanticDataSource);
        this.semanticDataSource.paginator = this.paginator;
        if (typeof (this.semanticDataSource) == 'undefined' || this.semanticDataSource.length == 0) {
          this.isEmpty = true;
        }
      })
    } else if (event.tab.textLabel == "Reports") {
      console.log('Clicked: ' + event.tab.textLabel);
      this.semanticModalService.getLogData(4).subscribe(res => {
        this.logData = res;
        console.log("data", this.logData)
        this.reportsDataSource = this.logData['data'];
        console.log(this.reportsDataSource);
        this.reportsDataSource = new MatTableDataSource(this.reportsDataSource);
        this.reportsDataSource.paginator = this.paginator;
        if (typeof (this.reportsDataSource) == 'undefined' || this.reportsDataSource.length == 0) {
          this.isEmpty = true;
        }
      })
    } else if (event.tab.textLabel == "Roles and Responsibilities") {
      console.log('Clicked: ' + event.tab.textLabel);
      this.semanticModalService.getLogData(3).subscribe(res => {
        this.logData = res;
        console.log("data", this.logData)
        this.rolesDataSource = this.logData['data'];
        console.log(this.rolesDataSource);
      this.rolesDataSource = new MatTableDataSource(this.rolesDataSource);
      this.rolesDataSource.paginator = this.paginator;
      if (typeof (this.rolesDataSource) == 'undefined' || this.rolesDataSource.length == 0) {
        this.isEmpty = true;
      }
      })
    } else if (event.tab.textLabel == "Tables and Custom tables") {
      console.log('Clicked: ' + event.tab.textLabel);
      this.semanticModalService.getLogData(1).subscribe(res => {
        this.logData = res;
        console.log("data", this.logData)
        this.tablesDataSource = this.logData['data'];
        console.log(this.tablesDataSource);
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

