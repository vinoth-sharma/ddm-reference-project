import { Component, OnInit, ViewChild } from "@angular/core";
import * as acemodule from "brace";
import "brace/mode/sql";
import "brace/theme/monokai";

import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../authentication.service";
import { QueryBuilderService } from "./query-builder.service";
import Utils from "../../utils";
import { Router } from "@angular/router";
import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import { SemdetailsService } from "../semdetails.service";
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: "app-query-builder",
  templateUrl: "./query-builder.component.html",
  styleUrls: ["./query-builder.component.css"]
})
export class QueryBuilderComponent implements OnInit {
  
  public aceEditor: any;
  public errorMessage: string  = "";
  public semanticId;
  public isLoading;
  public tableData = [];
  public columnsKeys;
  public allViews = [];
  public defaultError = "There seems to be an error. Please try again later.";
  public saveAsName;
  public isEditable:boolean;
  public customId;
  public pageData = {
    totalCount: 0,
    perPage: 0,
    numberPage: 0
  }
  public pageNum: number = 1;
  public displayedColumn = [];
  public dataSource:any;
  public routeValue: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private queryBuilderService: QueryBuilderService,
    private router: Router,
    private toasterService: ToastrService,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private semdetailsService:SemdetailsService,
    private authenticationService: AuthenticationService, 
  ) {}

  ngOnInit() {
     /*******    editor to run or save     ******/
    this.getEditor();
    /*******    get semantic id   ******/
    this.getSemanticId();
    this.getData();
    this.checkRoute();
    this.objectExplorerSidebarService.getCustomTables.subscribe(views => {
     this.allViews = views;
    });
  }

  public checkRoute() {
    if ( this.router.url === '/semantic/sem-sl/query-builder' ) {
        this.routeValue = true;
        this.authenticationService.setSlRoute(this.routeValue);
    } else {
      this.routeValue = false;
    }
  }

  getData() {
    this.objectExplorerSidebarService.$customQuery.subscribe(val => {
      this.aceEditor.setValue(val.custom_table_query || "");
      this.saveAsName = val.custom_table_name || "";
      this.customId = val.custom_table_id;
      this.isEditable = val.custom_table_name ? true: false;
      this.displayedColumn = [];
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.aceEditor.clearSelection();
      this.aceEditor.focus();
    });
  }
  /**
   * get editor using ACE
   */
  public getEditor(){
    this.aceEditor = acemodule.edit("sqlEditor");
    this.aceEditor.setTheme("ace/theme/monokai");
    this.aceEditor.getSession().setMode("ace/mode/sql");
    this.aceEditor.setOption("showPrintMargin", false);
    this.aceEditor.renderer.setShowGutter(false);
    this.aceEditor.focus();
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
   * sql validation
   */
  // public validateSql() {
  //   let sqlStatement = this.aceEditor.getValue();
  //   try {
  //     let ast = parser.parse(sqlStatement);
  //     let syntaxTree = parser.stringify(ast);
  //     this.errorMessage = "";
  //   } catch (e) {
  //     this.errorMessage = e.message;
  //   }
  // }

  /**
   * modal to get custom table name before saving
   */
  public openModal() {
    // this.validateSql();
    // if (this.errorMessage == "") {
      document.getElementById("open-modal-btn").click();
    // }
  }

  /**
   * isDisabled
   */
  public isDisabled() {
    return !(this.aceEditor.getValue().trim());
  }

  /**
   * reset editor
   */
  public reset() {
    this.errorMessage = "";
    this.tableData = [];
    this.dataSource = new MatTableDataSource([]);
    this.aceEditor.setValue("");
  }

  /**
   * save custom sql
   */
  public saveSql(name) {
     if(!this.validateTableName(name))
      return;
    Utils.showSpinner();
    let data = {
      sl_id: this.semanticId,
      query: this.aceEditor.getValue().trim(),
      table_name: name
    };

    this.queryBuilderService.saveSqlStatement(data).subscribe(
      res => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.toasterService.success(res["detail"]);
        this.getCustomTables();
      },
      err => {
        Utils.hideSpinner();
        // this.toasterService.error(err.message["error"] || this.defaultError);
        this.errorMessage = err.message["error"] || this.defaultError;
      }
    );
  }

  /**
   * sql execution
   */
  public executeSql(pageNum?,event?) {

    if(event && event.detail === 0){
      return false;
    }
    
    this.pageNum = pageNum;
    this.errorMessage = '';
    let data = { sl_id: this.semanticId, custom_table_query: this.aceEditor.getValue().trim(),page_no:pageNum || 1  };

    // if (!this.errorMessage) {
      Utils.showSpinner();
      this.columnsKeys = [];
      this.tableData = [];
      this.pageData = {
        totalCount: 0,
        perPage: 5,
        numberPage: 0
      };
      this.queryBuilderService.executeSqlStatement(data).subscribe(
        res => {
          Utils.hideSpinner();
   
          if (res['data']["list"].length) {
            this.displayedColumn = this.getColumnsKeys(res['data']["list"][0]);
            if(res['data']["list"].length === 1) {
              this.tableData = this.checkSingleRow(res['data']["list"]);
            }else {
              this.tableData = res['data']["list"];
            }
            
            
            this.dataSource = new MatTableDataSource(this.tableData);
           
            // if(!pageNum){
              this.pageData = {
                totalCount: res['data']["count"],
                perPage: res['data']["per_page"],
                numberPage: res['data']['number'] - 1
              };
              
              this.dataSource.paginator = this.paginator;
            // }
          }
        },
        err => {
          Utils.hideSpinner();
          // this.toasterService.error(err.message["error"] || this.defaultError);
         this.errorMessage = err.message["error"] || this.defaultError;
        }
      );
    // }
  }

  checkSingleRow(data) {
    let index = 0;
    for(let key in data[0]) {
      if(data[0][key] === null) {
        index++;
      }
    }
    
    return (index === 0)?data:[];
  }

  /**
   * getColumnsKeys
   */
  public getColumnsKeys(column) {
    return Object.keys(column);
  }

  /**
   * validateTableName
   */
  public validateTableName(val) {
    if(!val){
      this.toasterService.error("This should not empty");
      return false;
    }else if (this.allViews.find(ele => ele.custom_table_name === val)) {
      this.toasterService.error("This Table name already exists.");
      return false;
    }
    return true;
  }
  
  /**
   * getCustomTables
   */
  public getCustomTables() {
    this.semdetailsService.getviews(this.semanticId).subscribe(res => {
      this.objectExplorerSidebarService.setCustomTables(res["data"]["sl_view"]);
    });
  }

  /**
   * editQueryName
   */
  public editQueryName(name) {
    if(this.saveAsName != name  && !this.validateTableName(name))
       return;
    Utils.showSpinner();
    let data = {
      custom_table_id : this.customId,
      custom_table_name : name,
      custom_table_query : this.aceEditor.getValue().trim()
    }
    this.queryBuilderService.editQueryName(data).subscribe(
      res => {
        this.aceEditor.focus();
        this.toasterService.success(res['message']);
        this.saveAsName = name;
        Utils.hideSpinner();
        Utils.closeModals();
        this.getCustomTables();
      },
      err => {
        this.aceEditor.focus();
        this.toasterService.error(err.message["error"] || this.defaultError)
        Utils.hideSpinner();
      }
    )
  }

  public pageChange(e) {
    this.executeSql(e.pageIndex + 1);
  }

}
