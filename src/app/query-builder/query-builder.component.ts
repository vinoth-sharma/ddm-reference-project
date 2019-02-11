import { Component, OnInit } from "@angular/core";
import * as acemodule from "brace";
import "brace/mode/sql";
import "brace/theme/monokai";
import parser from "js-sql-parser";
import { ToastrService } from "ngx-toastr";
import { QueryBuilderService } from "./query-builder.service";
import Utils from "../../utils";
import { ActivatedRoute, Router } from "@angular/router";
import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import { SemdetailsService } from "../semdetails.service";

@Component({
  selector: "app-query-builder",
  templateUrl: "./query-builder.component.html",
  styleUrls: ["./query-builder.component.css"]
})
export class QueryBuilderComponent implements OnInit {
  public aceEditor: any;
  public errorMessage: string;
  public semanticId;
  public tableData = [];
  public columnsKeys;
  public allViews = [];
  public defaultError = "There seems to be an error. Please try again later.";
  public saveAsName;
  public isEditable:boolean;
  public customId;

  constructor(
    private queryBuilderService: QueryBuilderService,
    private router: Router,
    private toasterService: ToastrService,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private semdetailsService:SemdetailsService
  ) {}

  ngOnInit() {
    /*******    editor to run or save     ******/
    this.aceEditor = acemodule.edit("sqlEditor");
    this.aceEditor.setTheme("ace/theme/monokai");
    this.aceEditor.getSession().setMode("ace/mode/sql");
    this.aceEditor.setOption("showPrintMargin", false);
    this.aceEditor.renderer.setShowGutter(false);

    /*******    get semantic id   ******/
    this.getSemanticId();
    this.objectExplorerSidebarService.$customQuery.subscribe(val => {
      this.aceEditor.setValue(val.custom_table_query || "");
      this.saveAsName = val.custom_table_name || "";
      this.customId = val.custom_table_id;
      this.isEditable = val.custom_table_name ? true: false;
    });

    this.objectExplorerSidebarService.viewMethod$.subscribe(views => {
     this.allViews = views;
    });
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
  public validateSql() {
    let sqlStatement = this.aceEditor.getValue();
    try {
      let ast = parser.parse(sqlStatement);
      let syntaxTree = parser.stringify(ast);
      this.errorMessage = "";
    } catch (e) {
      this.errorMessage = e.message;
    }
  }

  /**
   * modal to get custom table name before saving
   */
  public openModal() {
    this.validateSql();
    if (this.errorMessage == "") {
      document.getElementById("open-modal-btn").click();
    }
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
        this.toasterService.error(err.message["error"] || this.defaultError);
      }
    );
  }

  /**
   * sql execution
   */
  public executeSql() {
    this.validateSql();
    let data = { sl_id: this.semanticId, query: this.aceEditor.getValue().trim() };

    if (!this.errorMessage) {
      Utils.showSpinner();
      this.columnsKeys = [];
      this.tableData = [];
      this.queryBuilderService.executeSqlStatement(data).subscribe(
        res => {
          Utils.hideSpinner();
          if (res["columnsWithData"].length) {
            this.columnsKeys = this.getColumnsKeys(res["columnsWithData"][0]);
            this.tableData = res["columnsWithData"];
          }
        },
        err => {
          Utils.hideSpinner();
          this.toasterService.error(err.message["error"] || this.defaultError);
        }
      );
    }
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
      this.objectExplorerSidebarService.viewMethod(res["data"]["sl_view"]);
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
        this.toasterService.success(res['message']);
        Utils.hideSpinner();
        Utils.closeModals();
        this.getCustomTables();
      },
      err => {
        this.toasterService.error(err.message["error"] || this.defaultError)
        Utils.hideSpinner();
      }
    )
  }
}
