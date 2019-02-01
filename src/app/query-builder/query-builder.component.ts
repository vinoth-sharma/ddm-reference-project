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
<<<<<<< HEAD
        Utils.closeModals();
        this.toasterService.success(res['detail']);
=======
        this.setOutputEditor(res);
        Utils.closeModals();
        this.toasterService.success("Custom SQL has been saved succesfully");
>>>>>>> ce7e3eb7f832574c45d2901b229ebca0b7a986a9
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
    let options = { sl_id: this.semantic_id, query: this.aceEditor.getValue() };

    if (this.errorMessage == "") {
      Utils.showSpinner();
      this.queryBuilderService.executeSqlStatement(options).subscribe(
        res => {
          Utils.hideSpinner();
<<<<<<< HEAD
          if(res['columnsWithData'].length){
            this.tableCreate(res['columnsWithData']);
            document.getElementById("outputEditor").style.display = "none";
            document.getElementById("otpt").style.display = "block";
          }else{
            document.getElementById("outputEditor").style.display = "block";
            document.getElementById("otpt").style.display = "none";
          }
=======
          this.setOutputEditor(res);
>>>>>>> ce7e3eb7f832574c45d2901b229ebca0b7a986a9
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
<<<<<<< HEAD

  /**
   * tableCreate
   */
  public tableCreate(val) {
    var col = [];
    for(var i = 0; i < val.length;i++){
      for(var key in val[i]){
        if(col.indexOf(key) === -1){
          col.push(key);
        }
      }
    }

    var table = document.createElement("table");
    var tr = table.insertRow(-1);
    for(var i = 0;i < col.length;i++){
      var th = document.createElement("th");
      th.innerHTML = col[i];
      tr.appendChild(th);
    }
    for(var i = 0;i <val.length;i++){
      tr = table.insertRow(-1);
      for(var j = 0;j < col.length;j++){
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = val[i][col[j]];
      }
    }

    var divContainer = document.getElementById("otpt");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    var t1 = document.querySelectorAll("table")[0];
    var t2 = document.querySelectorAll("th");
    t1.style.width = "100%";

    for (let i = 0; i < t2.length; i++) {
      t2[i].style.border = '1px solid #ddd';
      t2[i].style.borderCollapse = 'collapse';
      t2[i].style.padding = '2px 3px';
      t2[i].style.textAlign = 'center';
    }
    let t3 = document.querySelectorAll("td");

      for (let i = 0; i < t3.length; i++) {
        t3[i].style.border = '1px solid #ddd';
        t3[i].style.borderCollapse = 'collapse';
        t3[i].style.padding = '2px 3px';
        t3[i].style.textAlign = 'center';
      }
  }
=======
>>>>>>> ce7e3eb7f832574c45d2901b229ebca0b7a986a9
  
}
