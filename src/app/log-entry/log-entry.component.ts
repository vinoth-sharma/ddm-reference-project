import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityModalService } from '../security-modal/security-modal.service';
import { ToastrService } from "ngx-toastr";

import { MatTableDataSource } from "@angular/material/table";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

import { Router } from "@angular/router"
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-log-entry',
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.css']
})
export class LogEntryComponent implements OnInit {
  minDate = new Date(2019,0,1); 
  maxDate = new FormControl(new Date());
  defaultEndDate= new FormControl(new Date());
  date = new FormControl(this.dateDiff(new Date(), 30));
  serializedDate = new FormControl((new Date()).toISOString());
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  defaultError = "There seems to be an error. Please try again later.";
  logData = {};
  public dataSource: any;
  isEmpty: boolean;
  public columns: { key: string, value: string }[] = [];
  private rolesColumns = [
    { value: 'Changed by(ID)', key: 'changed_by_user_id' },
    { value: 'Changed by(Name)', key: 'changed_by_user_name' },
    { value: 'Changed for(ID)', key: 'changed_for_user_id' },
    { value: 'Changed for(Name)', key: 'changed_for_user_name' },
    { value: 'Change Type', key: 'change_type' },
    { value: 'Change Description', key: 'change_description' },
    { value: 'Change Timestamp', key: 'change_timestamp' },
    { value: 'Semantic Layer/ Privilege', key: 'sl_name' }];
  private reportsColumns = [
    { key: 'report_name', value: 'Report Name' },
    { key: 'sl_name', value: 'Semantic Layer' },
    { key: 'change_type', value: 'Change Type' },
    { key: 'change_description', value: 'Change Description' },
    { key: 'change_timestamp', value: 'Change Timestamp' },
    { value: 'Changed by(ID)', key: 'changed_by_user_id' },
    { value: 'Changed by(Name)', key: 'changed_by_user_name' },];
  private tablesColumns = [
    { key: 'new_name', value: 'New Name' },
    { key: 'sl_name', value: 'Semantic Layer' },
    { key: 'change_type', value: 'Change Type' },
    { key: 'change_description', value: 'Change Description' },
    { key: 'change_timestamp', value: 'Change Timestamp' }];
  private semanticColumns = [
    { value: 'Changed by(ID)', key: 'changed_by_user_id' },
    { value: 'Changed by(Name)', key: 'changed_by_user_name' },
    { value: 'Change Type', key: 'change_type' },
    { value: 'Change Description', key: 'change_description' },
    { value: 'Change Timestamp', key: 'change_timestamp' },
    { value: 'Semantic Layer', key: 'sl_name' }];
  columnNames = this.rolesColumns.map(col => col.key);
  isLoading: boolean = true;
  chosen: string = 'Roles and Responsibilities';
  public selections = ['Roles and Responsibilities', 'Semantic Layer', 'Tables and Custom tables', 'Reports'];
  selected: string = 'Roles and Responsibilities';
  // applyFilter(filterValue : string) {
  //       this.rolesDataSource.filter = filterValue.trim().toLowerCase();
  // }
  constructor(private semanticModalService: SecurityModalService,
    private toasterService: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.semanticModalService.getLogData(1,this.date.value ,this.defaultEndDate.value).subscribe(res => {
      this.logData = res;
      this.columns = this.rolesColumns;
      this.columnNames = this.columns.map(col => col.key);
      this.isLoading = false;
      // this.dataSource = new MatTableDataSource(this.logData['data']);
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
    // this.createDate();
  }

  dateDiff(date: Date, days: number = 0) {
    return new Date(date.getTime() - days * 24 * 3600 * 1000);
  }

  addEvent1(event: MatDatepickerInputEvent<Date>) {
    this.date.setValue(event.value);
  }


  addEvent2(event: MatDatepickerInputEvent<Date>) {
    this.defaultEndDate.setValue(event.value);
  }

  public routeBack() {
    this.router.navigate(['semantic/sem-sl/sem-existing']);
  }

  onSelect(event) {
this.chosen = event.source.value;
  }

  updateData() {
    this.isLoading = true;
    let tableType = 1;
    switch (this.chosen) {
      case 'Roles and Responsibilities':
        this.columns = this.rolesColumns;
        this.columnNames = this.columns.map(col => col.key);
        tableType = 1;
        break;

      case 'Semantic Layer':
        this.columns = this.semanticColumns;
        this.columnNames = this.columns.map(col => col.key);
        tableType = 2;
        break;

      case 'Tables and Custom tables':
        this.columns = this.tablesColumns;
        this.columnNames = this.columns.map(col => col.key);
        tableType = 3;
        break;

      case 'Reports':
        this.columns = this.reportsColumns;
        this.columnNames = this.columns.map(col => col.key);
        tableType = 4;
        break;

      default:
        this.columns = this.rolesColumns;      
        tableType = 4;
        break;
    }
    // console.log('Date: ', Object.prototype.toString.call(this.date.value));
        this.semanticModalService.getLogData(tableType,this.date.value ,this.defaultEndDate.value).subscribe(res => {
      this.logData = res;
      this.isLoading = false;
      this.dataSource = this.logData['data'];    
      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  } 
}
