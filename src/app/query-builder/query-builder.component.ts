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
  public aceOutputEditor: any;
  public errorMessage: string;
  public semantic_id;
  public  defaultError = "There seems to be an error. Please try again later.";

  constructor( private queryBuilderService: QueryBuilderService, private router: Router, private toasterService: ToastrService) {}

  ngOnInit() {
    /*******    editor to run or save     ******/
    this.aceEditor = acemodule.edit("sqlEditor");
    this.aceEditor.setTheme("ace/theme/monokai");
    this.aceEditor.getSession().setMode("ace/mode/sql");
    this.aceEditor.setOption("showPrintMargin", false);

    /*******    editor to show query result   ******/
    this.aceOutputEditor = acemodule.edit("outputEditor");
    this.aceOutputEditor.setTheme("ace/theme/monokai");
    this.aceOutputEditor.getSession().setMode("ace/mode/sql");
    this.aceOutputEditor.setOption("showPrintMargin", false);
    this.aceOutputEditor.setReadOnly(true);

    /*******    get semantic id   ******/
    this.getSemanticId();
  }

  /**
   * get semantic id from router
   */
  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semantic_id = element.data["semantic_id"];
      }
    });
  }

  /**
   * show the error or output in the output editor
   */
  public setOutputEditor(data) {
    this.aceOutputEditor.setValue("");
    this.aceOutputEditor.session.insert(
      this.aceOutputEditor.getCursorPosition(),
      data
    );
  }

  /**
   * get sql validation error
   */
  public getErrorMessage() {
    this.errorMessage = this.validateSql();
  }

  /**
   * sql validation
   */
  public validateSql() {
    let sqlStatement = this.aceEditor.getValue();
    try {
      let ast = parser.parse(sqlStatement);
      let syntaxTree = parser.stringify(ast);
      return "";
    } catch (e) {
      return e.message;
    }
  }

  /**
   * modal to get custom table name before saving
   */
  public openModal() {
    this.getErrorMessage();
    if (this.errorMessage == "") {
      document.getElementById("open-modal-btn").click();
    } else {
      this.setOutputEditor(this.errorMessage);
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
    this.aceOutputEditor.setValue("");
    this.aceEditor.setValue("");
  }

  /**
   * save custom sql
   */
  public saveSql(e) {
    Utils.showSpinner();
    let options = {
      sl_id: this.semantic_id,
      query: this.aceEditor.getValue(),
      table_name: e
    };

    this.queryBuilderService.saveSqlStatement(options).subscribe(
      res => {
        Utils.hideSpinner();
        this.setOutputEditor(res);
        Utils.closeModals();
        this.toasterService.success("Custom SQL has been saved succesfully");
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
    this.getErrorMessage();
    let options = { sl_id: this.semantic_id, query: this.aceEditor.getValue() };

    if (this.errorMessage == "") {
      Utils.showSpinner();
      this.queryBuilderService.executeSqlStatement(options).subscribe(
        res => {
          Utils.hideSpinner();
          this.setOutputEditor(res);
          Utils.closeModals();
        },
        err => {
          Utils.hideSpinner();
          this.toasterService.error(err.message["error"] || this.defaultError);
        }
      );
    } else {
      this.setOutputEditor(this.errorMessage);
    }
  }
  
}
