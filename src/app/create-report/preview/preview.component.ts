import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Utils from '../../../utils';
import { QueryBuilderService } from '../../query-builder/query-builder.service';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  public semanticId;
  public columnsKeys:any = [];
  public tableData:any = [];
  public pageData = {
    totalCount: 0,
    perPage: 0
  }
  public errorMessage:string = "";
  public pNum:number;

  constructor(
    private router: Router,
    private queryBuilderService:QueryBuilderService,
    private toasterService:ToastrService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    this.sharedDataService.$toggle.subscribe(val => {
      if(val){
        this.getSemanticId();
        this.executeSql(1);
      }
    });
   
  }

  public reset(){
    this.sharedDataService.setToggle(false);
    this.semanticId;
    this.columnsKeys = [];
    this.tableData = [];
   this.pageData = {
      totalCount: 0,
      perPage: 0
    }
    this.pNum = 1;
  }

    /**
   * get semantic id from router
   */
  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
  } 

  /**
   * sql execution
   */
  public executeSql(pageNum) {
    this.pNum = pageNum;
    let data = { sl_id: this.semanticId, custom_table_query: this.sharedDataService.getFormula(),page_no:pageNum || 1  };

      Utils.showSpinner();
      this.columnsKeys = [];
      this.tableData = [];
      this.queryBuilderService.executeSqlStatement(data).subscribe(
        res => {
          this.errorMessage = "";
          Utils.hideSpinner();
          this.pageData = {
            totalCount: res['data']["count"],
            perPage: res['data']["per_page"]
          };
          
          if (res['data']["list"].length) {
            this.columnsKeys = this.getColumnsKeys(res['data']["list"][0]);
            this.tableData = res['data']["list"];
          }
        },
        err => {
          Utils.hideSpinner();
          this.tableData = [];
          this.pageData = {
            totalCount: 0,
            perPage: 0
          }
          this.errorMessage = err['message']['error'];
        }
      );
  }


    /**
   * getColumnsKeys
   */
  public getColumnsKeys(column) {
    return Object.keys(column);
  }

  public goBack(){
    window.history.back();
  }

  public pageChange(pNum){
    this.executeSql(pNum);
  }
}