import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityModalService } from '../security-modal/security-modal.service';
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from "@angular/router"

@Component({
  selector: 'app-log-entry',
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.css']
})
export class LogEntryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  startDate = new Date(1990, 0, 1);
  defaultError = "There seems to be an error. Please try again later.";
  logData = {};
  // public rolesDataSource: any;
  public dataSource: any;
  // public semanticDataSource: any;
  // public reportsDataSource: any;
  // public tablesDataSource: any;
  isEmpty: boolean;
  public columns: { key: string, value: string }[] = [];
  private rolesColumns = [
    { value: 'Role changed by(ID)', key: 'changed_by_user_id' },
    { value: 'Role changed by(Name)', key: 'changed_by_user_name' },
    { value: 'Role changed for(ID)', key: 'changed_for_user_id' },
    { value: 'Role changed for(Name)', key: 'changed_for_user_name' },
    { value: 'Change Type', key: 'change_type' },
    { value: 'Change Description', key: 'change_description' },
    { value: 'Change Timestamp', key: 'change_timestamp' },
    { value: 'Semantic Layer', key: 'sl_name' }
  ];
  private reportsColumns = [
    { key: 'report_name', value: 'Report Name' },
    { key: 'sl_name', value: 'Semantic Layer' },
    { key: 'change_type', value: 'Chnage Type' },
    { key: 'change_description', value: 'Change Description' },
    { key: 'change_timestamp', value: 'Change Timestamp' }];
  columnNames = this.rolesColumns.map(col => col.key);
  isLoading: boolean = true;
  chosen: string = 'Roles and Responsibilities';
  public semanticColumns: string[] = ['changed_by_user_id', 'changed_by_user_name', 'changed_for_user_id', 'changed_for_user_name', 'sl_name', 'change_type', 'change_description', 'change_timestamp'];

  public tablesColumns: string[] = ['sl_name', 'change_type', 'change_description', 'new_name', 'change_timestamp'];
  public selections = ['Roles and Responsibilities', 'Semantic Layer', 'Tables and Custom tables', 'Reports'];
  selected: string = 'Roles and Responsibilities';
  // applyFilter(filterValue : string) {
  //       this.rolesDataSource.filter = filterValue.trim().toLowerCase();
  // }
  constructor(private semanticModalService: SecurityModalService,
    private toasterService: ToastrService,
    private router: Router) { }

  ngOnInit() {

    // this.rolesDataSource.paginator = this.paginator;
    // this.reportsDataSource.paginator = this.paginator;
    // this.semanticDataSource.paginator = this.paginator;
    // this.tablesDataSource.paginator = this.paginator;
    this.semanticModalService.getLogData(1).subscribe(res => {
      this.logData = res;
      this.columns = this.rolesColumns;
      this.columnNames = this.columns.map(col => col.key);
      this.isLoading = false;
      this.dataSource = this.logData['data'];
      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    //   }, error => {
    //     this.toasterService.error(this.defaultError);

    // });
    // };
    // }
  }

  public routeBack() {
    this.router.navigate(['semantic/sem-sl/sem-existing']);
  }

  onSelect(event) {
    this.isLoading = true;
    let tableType = 1;
    switch (event.source.value) {
      case 'Roles and Responsibilities':
        this.columns = this.rolesColumns;
        this.columnNames = this.columns.map(col => col.key);
        this.chosen = event.source.value;
        tableType = 1;
        break;

      case 'Semantic Layer':
        // this.columns = this.semanticColumns;
        this.columnNames = this.columns.map(col => col.key);
        this.chosen = event.source.value;
        tableType = 2;
        break;

      case 'Tables and Custom tables':
        // this.columns = this.tablesColumns;
        this.columnNames = this.columns.map(col => col.key);
        this.chosen = event.source.value;
        tableType = 3;
        break;

      case 'Reports':
        // console.log('Setting columns to ', this.reportsColumns);
        this.columns = this.reportsColumns;
        this.columnNames = this.columns.map(col => col.key);
        this.chosen = event.source.value;
        tableType = 4;
        break;

      default:
        this.columns = this.rolesColumns;
        this.chosen = event.source.value;
        tableType = 4;
        break;
    }
    this.semanticModalService.getLogData(tableType).subscribe(res => {
      this.logData = res;
      this.isLoading = false;
      this.dataSource = this.logData['data'];
      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (typeof (this.dataSource) == 'undefined' || this.dataSource.length == 0) {
        this.isEmpty = true;
      }
    })
  }
}

