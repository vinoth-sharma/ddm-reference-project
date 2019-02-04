import { Component, OnInit } from "@angular/core";
import * as acemodule from "brace";
import "brace/mode/sql";
import "brace/theme/monokai";
import parser from "js-sql-parser";
import { ToastrService } from "ngx-toastr";
import { QueryBuilderService } from "./query-builder.service";
import Utils from "../../utils";
import { ActivatedRoute, Router } from "@angular/router";

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
  public defaultError = "There seems to be an error. Please try again later.";

  constructor( private queryBuilderService: QueryBuilderService, private router: Router, private toasterService: ToastrService) {}

  ngOnInit() {
    /*******    editor to run or save     ******/
    this.aceEditor = acemodule.edit("sqlEditor");
    this.aceEditor.setTheme("ace/theme/monokai");
    this.aceEditor.getSession().setMode("ace/mode/sql");
    this.aceEditor.setOption("showPrintMargin", false);
    this.aceEditor.renderer.setShowGutter(false); 

    /*******    get semantic id   ******/
    this.getSemanticId();
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
    if(this.aceEditor.getValue() == "")
      return true;
    else  
      return false;
  }

  /**
   * reset editor
   */
  public reset() {
    this.errorMessage = "";
    this.aceEditor.setValue("");
  }

  /**
   * save custom sql
   */
  public saveSql(e) {
    Utils.showSpinner();
    let options = {
      sl_id: this.semanticId,
      query: this.aceEditor.getValue(),
      table_name: e
    };

    this.queryBuilderService.saveSqlStatement(options).subscribe(
      res => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.toasterService.success(res['detail']);
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
    let options = { sl_id: this.semanticId, query: this.aceEditor.getValue() };

    if (!this.errorMessage) {
      Utils.showSpinner();
      this.columnsKeys = [];
      this.tableData = [];
      this.queryBuilderService.executeSqlStatement(options).subscribe(
        res => {
          Utils.hideSpinner();
          if(res['columnsWithData'].length){
            this.columnsKeys = this.getColumnsKeys(res['columnsWithData'][0]);
            this.tableData = res['columnsWithData'];
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
    return Object.keys(column)
  }
  
}