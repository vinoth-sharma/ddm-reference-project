import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

import { SharedDataService } from "../shared-data.service";
import { Router } from '@angular/router';
import Utils from '../../../utils';
import { QueryBuilderService } from '../../query-builder/query-builder.service';

@Component({
  selector: 'app-create-report-layout',
  templateUrl: './create-report-layout.component.html',
  styleUrls: ['./create-report-layout.component.css']
})

export class CreateReportLayoutComponent implements OnInit {

  show: boolean;
  enableButtons: boolean;
  public semanticId;
  public columnsKeys:any = [];
  public tableData:any = [];
  dataSource;
  displayedColumn= [];
  public errorMessage:string = "";
  public isPreview:boolean = false;

  constructor(private router: Router,
    private sharedDataService: SharedDataService,
    private queryBuilderService:QueryBuilderService,) {
    // router.events.subscribe((val) => {
    //   console.log('in router'+val)
    //   console.log(NavigationEnd);
    //   if(val instanceof NavigationEnd){
    //     console.log(val,'in for');
    //     if(val.url == '/semantic/sem-reports/create-report/preview'){
    //       this.show = false;
    //     }else{
    //       this.show = true;
    //     }
    //   }
    //   // this.show = in routerNavigationEnd(id: 8, url: '/semantic/sem-reports/create-report/preview', urlAfterRedirects: '/semantic/sem-reports/create-report/preview')
    //   // if(val['NavigationEnd'].url == '/semantic/sem-reports/create-report/preview'){
    //   //   console.log('this is preview');
    //   // }
    // })
  }

  ngOnInit() {
    // TODO: jquery 
    $("#sidebar").toggleClass("active");

    this.sharedDataService.setSelectedTables([]);
    this.sharedDataService.resetFormula();
  }


  // --------------------




  // public pNum:number;

  // constructor(
  //   private router: Router,
  //   private queryBuilderService:QueryBuilderService,
  //   private toasterService:ToastrService,
  //   private sharedDataService: SharedDataService,
  //   private location:Location
  // ) { }

  // ngOnInit() {
  //   // this.sharedDataService.$toggle.subscribe(val => {
  //   //   if(val){
  //   //     this.getSemanticId();
  //   //     this.executeSql(1);
  //   //   }
  //   // });


   
  // }

  public reset(){
    // this.sharedDataService.setToggle(false);
    this.semanticId;
    this.columnsKeys = [];
    this.tableData = [];
  //  this.pageData = {
  //     totalCount: 0,
  //     perPage: 0
  //   }
  //   this.pNum = 1;
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
  // public executeSql(pageNum) {
  //   this.pNum = pageNum;
  //   let data = { sl_id: this.semanticId, custom_table_query: this.sharedDataService.getFormula(),page_no:pageNum || 1  };

  //     Utils.showSpinner();
  //     this.columnsKeys = [];
  //     this.tableData = [];
  //     this.queryBuilderService.executeSqlStatement(data).subscribe(
  //       res => {
  //         this.errorMessage = "";
  //         Utils.hideSpinner();
  //         this.pageData = {
  //           totalCount: res['data']["count"],
  //           perPage: res['data']["per_page"]
  //         };
          
  //         if (res['data']["list"].length) {
  //           this.columnsKeys = this.getColumnsKeys(res['data']["list"][0]);
  //           this.tableData = res['data']["list"];
  //         }
  //       },
  //       err => {
  //         Utils.hideSpinner();
  //         this.tableData = [];
  //         this.pageData = {
  //           totalCount: 0,
  //           perPage: 0
  //         }
  //         this.errorMessage = err['message']['error'];
  //       }
  //     );
  // }

  public executeSql() {
    let query = 'SELECT * FROM ('+this.getFormula()+ ') WHERE ROWNUM <= 10'

    // let query = 'select ANHR_PROD_IND from vsmddm.CDC_VEH_EDD_EXTRACTS WHERE ROWNUM <= 10'
    let data = { sl_id: this.semanticId, custom_table_query: query,page_no: 1 , per_page:10};

      Utils.showSpinner();
      this.columnsKeys = [];
      this.tableData = [];
      this.queryBuilderService.executeSqlStatement(data).subscribe(
        res => {
          this.errorMessage = "";
          Utils.hideSpinner();
          // this.pageData = {
          //   totalCount: res['data']["count"],
          //   perPage: res['data']["per_page"]
          // };
          
          if (res['data']["list"].length) {
            this.columnsKeys = this.getColumnsKeys(res['data']["list"][0]);
            this.tableData = res['data']["list"];
            // this.dataSource = new MatTableDataSource(this.columnsKeys)
            this.dataSource = this.tableData;
            
            this.displayedColumn = this.columnsKeys;
          }
        },
        err => {
          Utils.hideSpinner();
          this.tableData = [];
          this.errorMessage = err['message']['error'];
        }
      );
  }

  public getFormula(){
    let formula = document.getElementById('formula').innerText;
    return formula;
  }

    /**
   * getColumnsKeys
   */
  public getColumnsKeys(column) {
    return Object.keys(column);
  }

  public goBack(){
    // this.location.back();
  this.isPreview = false;
  }


  public goToView(){
    this.getSemanticId();
    this.executeSql();
    this.isPreview = true;
    
  }

  enablePreview(event){
    this.enableButtons = event;
  }

}