import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-table-container',
  templateUrl: './table-container.component.html',
  styleUrls: ['./table-container.component.css']
})
export class TableContainerComponent implements AfterViewInit {
  @Input() sheetData: any;

  displayedColumns: string[] = [];
  data = [];

  customziedData:any;
  resultsLength = 0;
  // isLoadingResults = true;
  // isRateLimitReached = false;
  fontfamily:string = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  headercolor:string = "black";
  headerbgcolor:string = "white";
  fontsize:string = '14px';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _httpClient: HttpClient, public tableService: ReportViewService) { }

  ngOnInit() {
    // console.log(this.sheetData);
  }

  ngAfterViewInit() {
    // console.log(this.sheetData);
    this.customziedData = this.sheetData.tabs.filter(ele=>ele.tab_type === 'table')[0];
    
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          // console.log(this.sort.active);
          // this.isLoadingResults = true;
          this.tableService.loaderSubject.next(true);
          let column = this.sort.active;
          if(this.customziedData.data.isCustomized)
             column = this.getOriginalColumnName(this.sort.active);
          // console.log(column);
          
          return this.tableService.getReportDataFromHttp(column, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize, this.sheetData, 0);
        }),
        map((data: any) => {
          // console.log(data);
          // this.displayedColumns = Object.keys(data.data.list[0])
          this.displayedColumns = data.data.sql_columns;
          this.tableService.loaderSubject.next(false);
          // this.isRateLimitReached = false;
          this.resultsLength = data.data.count;
          return data.data.list;
        }),
        catchError(() => {
          // this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data =>{ 
        this.data = data;
        this.tableService.getTableDataDone.next(this.data)
        if(this.customziedData.data.isCustomized)
          this.setCustomizedData();
      });
  }

  setCustomizedData(){
    this.displayedColumns = [];
    this.customziedData.data.columnName_mapping.forEach(col=>{
       if(col.isColumnSelected)
          this.displayedColumns.push(col.view_column_name)
    });    
    // console.log(this.displayedColumns);
    this.fontfamily = this.customziedData.data.fontFamily;
    this.fontsize = this.customziedData.data.hasOwnProperty('fontSize') ? this.customziedData.data.fontSize : '14px';
    this.headercolor = this.customziedData.data.headerColor;
    this.headerbgcolor = this.customziedData.data.headerBgColor;
  }

  getOriginalColumnName(column){
    let column_name = ''
    if(this.customziedData.data.isCustomized)
      this.customziedData.data.columnName_mapping.forEach(element => {
        if(element.view_column_name === column)
          column_name = element.original_column_name
      });
    else
      column_name = column
    return column_name
  }

}


