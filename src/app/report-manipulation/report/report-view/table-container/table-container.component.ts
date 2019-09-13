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

  resultsLength = 0;
  // isLoadingResults = true;
  // isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _httpClient: HttpClient, public tableService: ReportViewService) { }

  ngOnInit() {
    // console.log(this.sheetData);
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          console.log(this.sort.active);
          // this.isLoadingResults = true;
          this.tableService.loaderSubject.next(true);

          return this.tableService.getReportDataFromHttp(this.sort.active, this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize, this.sheetData, 0);
        }),
        map((data: any) => {
          // console.log(data);
          // this.displayedColumns = Object.keys(data.data.list[0])
          this.displayedColumns = data.data.sql_columns;
          // Flip flag to show that loading has finished.
          // this.isLoadingResults = false;
          this.tableService.loaderSubject.next(false);
          // this.isRateLimitReached = false;
          this.resultsLength = data.data.count;
          return data.data.list;
        }),
        catchError(() => {
          // this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          // this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  headerClicked(event){
    console.log(event);
    
  }
}


