import { Component, OnInit } from '@angular/core';
import { AddConditionsService } from "./add-conditions.service";
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate.min.js';
import { SharedDataService } from '../shared-data.service';
import { ToastrService } from "ngx-toastr";
import { FormControl, Validators } from "@angular/forms";
import Utils from "../../../utils";

@Component({
  selector: 'app-add-conditions',
  templateUrl: './add-conditions.component.html',
  styleUrls: ['./add-conditions.component.css']
})
export class AddConditionsComponent implements OnInit {
  public formula: string = '';
  tableData = [];
  tableInfo = [];
  isValid : boolean = false;
  isMissing : boolean = false;
  conditionTables = [];
  selectedColumns = [];
  columnName: string;
  selectedTable;
  valueString = '';
  tableControl: FormControl = new FormControl('', [Validators.required]);
  selectedonditions = [];
  public conditionSelected: string = '';
  public conditions = [];
  public selectedId;
  selectedTables = [];
  public searchValue: string;
  checkRowEmpty = [];
  tables = [];
  populateColumns;
  isEmpty: boolean = false;
  public condition = [];
  public columns = [];
  public isLoading: boolean = true;
  public selected;
  public values = [];
  public lastObj = {};
  public excelValues = [];
  public selectedObj;
  public cachedConditions = [];
  public headers = ["(", "Table", "Attribute", "Condition", "Value", ")", "Operator"];
  public operator = ["-", "AND", "OR"];
  public conditionn = ["=", "!=", "<", ">", "<=", ">=", "<>", "BETWEEN", "LIKE", "NOT LIKE", "IN"];
  public createFormula = [];
  public isUploaded: boolean = false;
  queryField: FormControl = new FormControl();
  bracketsClose = []; bracketsOpen = [];
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private addConditions: AddConditionsService,
    private sharedDataService: SharedDataService,
    private toasterService: ToastrService) { }

  public addColumn(con) {
    let temp = Object.values(con);
    if (temp.includes("")) {
      this.toasterService.error("Please fill all required fields.");
    } else {
      this.createFormula.push({ attributes: "", close: ")", values: "", condition: "", open: "(", operator: "" });
    }
  };


  public onTableSelection(event, con) {
    console.log("con", con);
    // con.columns = this.selectedTables.filter(item => item.table.select_table_name === event.target.value)[0].table.mapped_column_name;
    con.columns = this.selectedTables.filter(item => item.select_table_alias === event.target.value)[0].table.mapped_column_name;
  }

  public removeColumn(con) {
    this.createFormula.splice(this.createFormula.indexOf(con), 1);
  }

  checkOpen(event) {
    return (event.keyCode == 40);
  }

  checkClose(event) {
    return (event.keyCode == 41);
  }

  fetchParameters() {
    this.toasterService.error("No Parameters Available.");
  }

  public defineFormula() {    
    if(this.createFormula.length){
    for (let i = 0; i <= this.createFormula.length - 2; ++i) {
      let obj = Object.values(this.createFormula[i]);
      if (obj.includes("")) {
        this.toasterService.error("Please fill all required fields");
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    }
      for (let i = 0; i < this.createFormula.length; ++i) {
        const curRow = this.createFormula[i];
        this.bracketsOpen.push(curRow['open']);
        this.bracketsClose.push(curRow['close']);
        if (this.bracketsOpen.length === this.bracketsClose.length) {
          this.isMissing = false;
        } else {
          this.isMissing = true;
          this.toasterService.error("Brackets missing.");
        }
      }
    this.lastObj = this.createFormula[this.createFormula.length - 1];
    if ((this.lastObj['operator'] == "AND") || (this.lastObj['operator'] == "OR") || (this.lastObj['values'] == '') || (this.lastObj['condition'] == '') ||
      (this.lastObj['attributes'] == '') || (this.lastObj['table'] == '')) {
      this.toasterService.error("Invalid Syntax.");
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }}
      if(this.isMissing === false && this.isValid === false && this.isEmpty === false){
        this.conditionSelected = '';
        for (let i = 0; i < this.createFormula.length; ++i) {
          const curRow = this.createFormula[i];
          this.conditionSelected += `${curRow.open} ${curRow.table}.${curRow.attributes} ${curRow.condition} ${curRow.values}
          ${curRow.close} ${curRow.operator}`;
        }
        for (let i = 0; i < this.createFormula.length; ++i) {
          const curRow = this.createFormula[i];
          this.selectedColumns.push(curRow['attributes']);
          this.conditionTables.push(curRow['table']);
        }
        this.selectedColumns = [...new Set(this.selectedColumns)];
        this.conditionTables = [...new Set(this.conditionTables)];
        this.formula = "WHERE" + this.conditionSelected;
        this.sharedDataService.setFormula(['where'], this.conditionSelected);
        let conditionObj = [{
          "condition_name": this.columnName,
          "table_used": this.conditionTables,
          "columns_used_condition": this.selectedColumns,
          "condition_formula": this.conditionSelected,
          "applied_flag_condition": true,
          "condition_json": this.createFormula
        }];
        this.sharedDataService.setConditionData(conditionObj);
      }
  }


  public uploadFile(event: any, con: any) {
    let filesData = event.target.files[0];
    XlsxPopulate.fromDataAsync(filesData)
      .then(workbook => {
        let value = workbook.sheet(0).range("A1:A100").value();
        this.excelValues.push(value);
        let list = [];
        this.excelValues.forEach(element => {
          element.forEach(data => {
            data.forEach(d => {
              if (typeof d !== "undefined") {
                list.push(d);
              }
            });
          });
        });
        this.values = list;
        this.valueString = `( ${this.values.join(', ')} )`;
        this.isUploaded = true;
        con.values = this.valueString;
      })

  }

  addColumnBegin() {
    this.createFormula.push({ attributes: "", close: ")", values: "", condition: "", open: "(", operator: "" });
  }

  ngOnInit() {
    this.sharedDataService.selectedTables.subscribe(tableList => {
      this.selectedTables = tableList
      this.tables = this.getTables();
      this.tables = [...new Set(this.tables)];
      // this.getConditions();
    });
  }

  removeFormula() {
    this.formula = '';
  }

  public getExistingList(value: string) {
    return this.cachedConditions.filter(option =>
      option['condition_name'].toLowerCase().includes(value.toLowerCase())
    )

  }
  // public getConditions(callback = null) {
  //   let options = {};
  //   options["table_list"] = this.tables;
  //   console.log(options, "options")
  //   this.addConditions.fetchCondition(options).subscribe(res => {
  //     this.condition = res['existing_conditions'];
  //     console.log("conditions", this.condition);
  //     this.cachedConditions = this.condition.slice();
  //     this.isLoading = false;
  //     if (callback) {
  //       callback();
  //     }
  //   })
  // }

  public triggerFileBtn() {
    document.getElementById("valueInput").click();
  }

  public onSelect(conditionVal, conditionId, item) {
    this.selectedObj = this.condition.find(x =>
      x.condition_name.trim().toLowerCase() == conditionVal.trim().toLowerCase()
    ).condition_json;
    this.selectedId = conditionId;
    if (item.checked == true) {
      for (let i = 0; i < this.selectedObj.length; ++i) {
        if (!this.createFormula.includes(this.selectedObj[i])) {
          this.createFormula.push(this.selectedObj[i]);
        }
      }
    } else {
      for (let i = 0; i < this.selectedObj.length; ++i) {
            if (this.createFormula.includes(this.selectedObj[i])) {
              this.createFormula.splice(this.selectedObj[i], 1);
            }}}}

  public deleteCondition() {
    Utils.showSpinner();
    this.addConditions.delCondition(this.selectedId).subscribe(response => {
      // this.getConditions(() => {
        Utils.hideSpinner();
        this.toasterService.success("Condition deleted Successfully");
        for (let i = 0; i < this.selectedObj.length; ++i) {
          if (this.createFormula.includes(this.selectedObj[i])) {
            this.createFormula.splice(this.selectedObj[i], 1);
          }
        }
      });
    // }, error => {
      // this.toasterService.error(error.message || this.defaultError);
    // });
  }

  public filterList(searchText: string) {
    this.condition = this.cachedConditions;
    if (searchText) {
      this.condition = this.condition.filter(condition => {
        if (condition['condition_name']
          && (condition['condition_name'].toLowerCase().indexOf(searchText.toLowerCase())) > -1) {
          return condition;
        }
      });
    }
  }

  public getTables() {
      return this.selectedTables.map(element => {
        // return element['table']['select_table_name'];
        return {
          'name':element['table']['select_table_name'],
          'alias': element['select_table_alias']
      }
    });
  }
}