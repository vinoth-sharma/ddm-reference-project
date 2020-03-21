import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;

  resultsLength = 0;
  data = [];
  displayedColumns = [];
  isLoadingResults:boolean = false;
  errorMessage='' ;
  isQueryError:boolean = false;

  constructor(private _httpClient: HttpClient,
    private queryBuilderService:QueryBuilderService, private cdRef : ChangeDetectorRef
    ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
   
    this.cdRef.detectChanges();
  }


  ngOnChanges(){
    this.getPaginationData();
    
  }

  getPaginationData(){ 
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          // console.log(this.sort.active);
          this.isLoadingResults = true;
          this.isQueryError = false;
          return this.getData(this.paginator.pageIndex, this.paginator.pageSize)
        }),
        map((data: any) => {
          // this.resultsLength = data.data.count;
          return data
        }),
        catchError((error) => {
          this.isQueryError = true;
          this.isLoadingResults = false;
          // this.isRateLimitReached = true;
          let errObj: any = {
            status: error.status,
            message: error.error
          };
          this.errorMessage = errObj['message']['error'];
          return observableOf([]);
        })
      ).subscribe(data =>{ 
        this.dataTransformation(data);
      },(err)=>{
      });
  }

  dataTransformation(data){

    if(Object.keys(data).length > 0) {
    this.displayedColumns = Object.keys(data.data.list[0]);
    this.resultsLength = data.data.total_row_count;
    this.l_columnProps = data.data.hasOwnProperty('column_properties')?data.data['column_properties']:[];
    this.data = data.data.list;
    this.doDateFormatting();
    this.isLoadingResults = false;
    }
  }
  
  l_columnProps = [];
  doDateFormatting(){
    this.l_columnProps.forEach(column=>{
      if(column.column_data_type === 'DATE'){
        let l_column = column.mapped_column;
        this.data.forEach(row => {
          row[l_column] = row[l_column]?this.dateFormattor(new Date(row[l_column])):row[l_column];
        });
      }
    })
  }

  dateFormattor(date){
    let l_date = date.getDate();
    let l_year = date.getFullYear();
    let l_month = date.toLocaleDateString("en-US",{month: 'short'})
    return l_date + "-" + l_month + "-" + l_year;
  }

  getData(pageI,pageSize){
    // console.log(pageI,pageSize);
    // let data = { sl_id: this.semanticId, custom_table_query: query,page_no: 1 , per_page:250};
    
    let request =  {
      sl_id : this.reqData.sl_id,
      custom_table_query : this.reqData.query,
      page_no : pageI + 1,
      per_page : pageSize?pageSize+1:250 + 1
    }
    let serviceUrl = `${environment.baseUrl}semantic_layer/execute_custom_query/`;

    return this._httpClient
      .post(serviceUrl, request);

      // .pipe(catchError(this.handleError.bind(this)));
  }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error
    };
    this.errorMessage = errObj['message']['error'];
    throw errObj;
  }
}
