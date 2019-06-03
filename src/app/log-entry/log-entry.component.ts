import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityModalService } from '../security-modal/security-modal.service';
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource, MatPaginator, MatSort, MatDatepickerInputEvent } from '@angular/material';
import { Router } from "@angular/router"
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-log-entry',
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.css']
})
export class LogEntryComponent implements OnInit {

  date = new FormControl(new Date());
  // date = new FormControl(new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear());
  // public defaultDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  defaultEndDate = new FormControl(this.dateDiff(new Date(), 30));
  // defaultEndDate = new FormControl((new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear());
  // defaultEndDate = new FormControl(new Date(new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear())
  serializedDate = new FormControl((new Date()).toISOString());
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  startDate = new Date(2019 , 0, 1);
  defaultError = "There seems to be an error. Please try again later.";
  logData = {};
  public dataSource: any;
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
    { value: 'Semantic Layer', key: 'sl_name' }];
  private reportsColumns = [
    { key: 'report_name', value: 'Report Name' },
    { key: 'sl_name', value: 'Semantic Layer' },
    { key: 'change_type', value: 'Change Type' },
    { key: 'change_description', value: 'Change Description' },
    { key: 'change_timestamp', value: 'Change Timestamp' },
    { value: 'Role changed by(ID)', key: 'changed_by_user_id' },
    { value: 'Role changed by(Name)', key: 'changed_by_user_name' },];
  private tablesColumns = [
    { key: 'new_name', value: 'New Name' },
    { key: 'sl_name', value: 'Semantic Layer' },
    { key: 'change_type', value: 'Change Type' },
    { key: 'change_description', value: 'Change Description' },
    { key: 'change_timestamp', value: 'Change Timestamp' }];
  private semanticColumns = [
    { value: 'Role changed by(ID)', key: 'changed_by_user_id' },
    { value: 'Role changed by(Name)', key: 'changed_by_user_name' },
    { value: 'Role changed for(ID)', key: 'changed_for_user_id' },
    { value: 'Role changed for(Name)', key: 'changed_for_user_name' },
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
    console.log(this.defaultEndDate.value, this.date.value)
    this.semanticModalService.getLogData(1,this.date.value ,this.defaultEndDate.value).subscribe(res => {
      this.logData = res;
      this.columns = this.rolesColumns;
      this.columnNames = this.columns.map(col => col.key);
      this.isLoading = false;
      this.dataSource = new MatTableDataSource(this.logData['data']);
      console.log(this.dataSource,"datainitial");
      // this.dataSource = new MatTableDataSource(this.dataSource);
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
    return new Date(date.getTime() + days * 24 * 3600 * 1000);
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
    // switch (event.source.value) {
    switch (this.chosen) {
      case 'Roles and Responsibilities':
        this.columns = this.rolesColumns;
        this.columnNames = this.columns.map(col => col.key);
        // this.chosen = event.source.value;
        tableType = 1;
        break;

      case 'Semantic Layer':
        this.columns = this.semanticColumns;
        this.columnNames = this.columns.map(col => col.key);
        // this.chosen = event.source.value;        
        tableType = 2;
        break;

      case 'Tables and Custom tables':
        this.columns = this.tablesColumns;
        this.columnNames = this.columns.map(col => col.key);
        // this.chosen = event.source.value;        
        tableType = 3;
        break;

      case 'Reports':
        this.columns = this.reportsColumns;
        this.columnNames = this.columns.map(col => col.key);
        // this.chosen = event.source.value;        
        tableType = 4;
        break;

      default:
        this.columns = this.rolesColumns;
        // this.chosen = event.source.value;        
        tableType = 4;
        break;
    }
    console.log('Date: ', Object.prototype.toString.call(this.date.value));
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

