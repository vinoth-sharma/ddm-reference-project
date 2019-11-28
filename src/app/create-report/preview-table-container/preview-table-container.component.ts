import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { QueryBuilderService } from 'src/app/query-builder/query-builder.service';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-preview-table-container',
  templateUrl: './preview-table-container.component.html',
  styleUrls: ['./preview-table-container.component.css']
})
export class PreviewTableContainerComponent implements OnInit {

  @Input() reqData:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  resultsLength = 0;
  data = [];
  displayedColumns = [];
  isLoadingResults:boolean = false;

  constructor(private _httpClient: HttpClient,
    private queryBuilderService:QueryBuilderService,
    ) { }

  ngOnInit() {
    // console.log(this.sheetData);
  }

  ngAfterViewInit(){
  }


  ngOnChanges(){
    this.getPaginationData();
  }

  getPaginationData(){ 
    console.log(this.reqData);
    
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          // console.log(this.sort.active);
          this.isLoadingResults = true;
 
          // console.log(column);
          return this.getData(this.paginator.pageIndex, this.paginator.pageSize)
          // return this.  .getReportDataFromHttp(column, this.sort.direction,
          //   this.paginator.pageIndex, this.paginator.pageSize, this.sheetData, 0);
        }),
        map((data: any) => {
          // console.log(data);
          // this.displayedColumns = Object.keys(data.data.list[0])

          // this.resultsLength = data.data.count;
          return data
        }),
        catchError(() => {
          // this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data =>{ 
        console.log(data);
        this.dataTransformation(data);
      });
  }

  dataTransformation(data){
    this.displayedColumns = Object.keys(data.data.list[0]);
    this.resultsLength = data.data.total_row_count;
    this.data = data.data.list;
    this.isLoadingResults = false;
  }

  getData(pageI,pageSize){
    console.log(pageI,pageSize);
    // let data = { sl_id: this.semanticId, custom_table_query: query,page_no: 1 , per_page:250};
    
    let request =  {
      sl_id : this.reqData.sl_id,
      custom_table_query : this.reqData.query,
      page_no : pageI + 1,
      per_page : pageSize?pageSize+1:250 + 1
    }
    let serviceUrl = `${environment.baseUrl}semantic_layer/execute_custom_query/`;

    return this._httpClient
      .post(serviceUrl, request)
      .pipe(catchError(this.handleError));
  }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };

    throw errObj;
  }
}
