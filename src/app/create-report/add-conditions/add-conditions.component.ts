import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate.min.js';
import { SharedDataService } from "../shared-data.service";
import { AddConditionsService } from "./add-conditions.service";
import Utils from "../../../utils";
import { ToastrService } from "ngx-toastr";
import { ConstantService } from '../../constant.service';
import { ListOfValuesService } from '../../modallist/list-of-values.service';

@Component({
  selector: 'app-add-conditions',
  templateUrl: './add-conditions.component.html',
  styleUrls: ['./add-conditions.component.css']
})
export class AddConditionsComponent implements OnInit {

  rowUsedTable;
  results: any[] = [];
  oldValue: any;
  current;
  tableId;
  valueList = [];
  selectedTables = [];
  existingList: any[] = [];
  originalExisting: any[] = [];
  queryField: FormControl = new FormControl();
  private functions;
  public columns = [];
  public formula: string = '';
  conditionTables = [];
  selectedColumns = [];
  columnName;
  lov = [];
  tables = [];
  public condition = [];
  public selected;
  public values = [];
  public selectedObj;
  public cachedConditions = [];
  public headers = ["Item", "Condition", "Value(s)", "Operator"];
  public operator = ["AND", "OR"];
  public conditionList = ["=", "!=", "<", ">", "<=", ">=", "<>", "BETWEEN", "LIKE", "NOT LIKE", "IN", "NOT BETWEEN", "NOT IN", "IS NULL", "IS NOT NULL"];
  public createFormula = [];
  lovValueList = [];
  public tableIds = [];
  whereConditionPrefix = '';
  areConditionsEmpty = true;
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private sharedDataService: SharedDataService,
    private addConditions: AddConditionsService,
    private toasterService: ToastrService,
    private constantService: ConstantService,
    private listOfValuesService : ListOfValuesService
  ) {
    this.functions = this.constantService.getSqlFunctions('aggregations');
  }

  ngOnInit() {
    this.sharedDataService.getNextClicked().subscribe(isClicked => {
      this.tableIds = this.tables.map(table => {
        return table.id;
      });
      this.getConditions();
    });

    this.sharedDataService.selectedTables.subscribe(tableList => {

      this.selectedTables = tableList;
      this.reset();
      this.tables = this.getTables();
      this.columns = this.getColumns();
      let keyValues = this.sharedDataService.getNewConditionData().data;
      this.columnName = this.sharedDataService.getNewConditionData().name;
      this.removeDeletedTableData(keyValues);
    });

    this.sharedDataService.resetQuerySeleted.subscribe(ele => {
      this.createFormula = [{ attribute: '', values: '', condition: '', operator: '', tableId: '', conditionId: '' }];
      this.columnName = '';
      this.condition = [];
    });
  }

  public fetchLov(id, column) {
      let options = {};
      options["tableId"] = id;
      options['columnName'] = column;
      let valueList = [];
      this.listOfValuesService.getLov(options).subscribe(res => {
        this.lovValueList = res['data'];  
        this.lovValueList.forEach(obj => this.valueList.push(obj['lov_name'])) 
      })
    }

  onSelectLov(con) {
    console.log(con, "lov received");
    let valueString;
    this.lov = this.lovValueList.find(x =>
      x.lov_name.trim().toLowerCase() == con.values.trim().toLowerCase()
    ).value_list;
    console.log(this.lov, "selected lov");
    if (typeof this.lov[0] === "number") {
      con.values = `( ${this.lov} )`;
    } else if (typeof (this.lov[0]) === "string") {
      let uploadData = this.lov.map(t => `'${t}'`);
      con.values = `( ${uploadData} )`;
    }
    // con.values = valueString;
  }
  

  // public searchedExistingList(value: string) {
  //   return this.originalExisting.filter(option =>
  //     option['calculated_field_name'].toLowerCase().includes(value.toLowerCase())
  //   )
  // }

  public getTables() {  //fetch selected tables
    return this.selectedTables.map(element => {
      return {
        'name': element['table']['select_table_name'],
        'id': element['table']['select_table_id'],
        'alias': element['select_table_alias']
      };
    });
  }

  public getColumns() {   //fetch columns for selected tables
    let columnData = [];
    let columnWithTable = this.selectedTables.map(element => {
      return element['table']['mapped_column_name'].map(column => {
        return `${element['select_table_alias']}.${column}`
      });
    });
    columnWithTable.forEach(data => {
      columnData.push(...data);
    });
    return columnData;
  }

  public addColumn() { // called on add button next to every row
    this.createFormula.push({
      values: "", condition: "", attribute: "", operator: "", tableId: '', conditionId: ''
    });
  };

  addColumnBegin() {    // called on ngOninit for default row.
    return [{ attribute: "", values: "", condition: "", operator: "", tableId: '', conditionId: '' }];
  }

  resetRow(con) {
    let id = con.conditionId;
    this.condition.forEach(data => {
      if (id === data.condition_id) {
        data.checked = false;
      }
    })
    this.createFormula.splice(this.createFormula.indexOf(con), 1);
    this.addColumn();
    this.columnName = '';
    this.reset();
  }

  public removeColumn(con) {  // remove row on remove button 
    let id = con.conditionId;
    this.condition.forEach(data => {
      if (id === data.condition_id) {
        data.checked = false;
      }
    })
    this.createFormula.splice(this.createFormula.indexOf(con), 1);
  }

  public validateFormula() {
    let isFormulaInvalid = true;
    const isValid = this.createFormula.reduce((res, item, index) => res && this.isRowValid(item, index), true);
    if (this.areConditionsEmpty && isValid) {
      this.whereConditionPrefix = '';
      isFormulaInvalid = !isValid;
      this.whereConditionPrefix = 'WHERE';
    }
    return isFormulaInvalid;
  }

  isRowValid(formulaRow: { attribute: string, condition: string, values: string, operator: string }, index: number) {
    if (index === 0 && this.isNullOrEmpty(formulaRow.attribute) && this.isNullOrEmpty(formulaRow.condition) && this.isNullOrEmpty(formulaRow.values)) {
      this.areConditionsEmpty = true;
      return true;
    } else {
      this.areConditionsEmpty = false;
      if (['IS NULL', 'IS NOT NULL'].includes(formulaRow.condition)) {
        if (!this.isNullOrEmpty(formulaRow.values)) {
          return false;
        }
      } else {
        if (this.isNullOrEmpty(formulaRow.values)) {
          return false;
        }
      }
      if (index === this.createFormula.length - 1) {
        if (!this.isNullOrEmpty(formulaRow.operator)) {
          return false;
        }
      } else {
        if (this.isNullOrEmpty(formulaRow.operator)) {
          return false;
        }
      }
      if (this.isNullOrEmpty(formulaRow.attribute) || this.isNullOrEmpty(formulaRow.condition)) {
        return false;
      }
    }
    return true;
  }

  isNullOrEmpty(value) {
    if (!value || value === '') {
      return true;
    }
    return false;
  }

  clearCondition() {
    let obj = this.createFormula[0];
    if (obj.attribute == '' && obj.values == '' && obj.condition == '' && obj.operator == '') {
      this.sharedDataService.setFormula(['where'], '');
      let conditionObj = [];
      this.sharedDataService.setConditionData(conditionObj);
    }
  }

  public defineFormula() {  // called on clicking finish 
    if (this.createFormula.length) {
      if (!this.validateFormula()) {
        if (!this.areConditionsEmpty) {
          // this.conditionSelected = this.createFormula.reduce((res, item) => `${res} ${item.attribute} ${item.condition} ${item.values} ${item.operator}`, '');
          let conditionSelected = this.createFormula.reduce((res, item) => `${res} ${item.attribute} ${item.condition} ${item.values} ${item.operator}`, '');
          if ((conditionSelected.match(/[(]/g) || []).length === (conditionSelected.match(/[)]/g) || []).length) {
            // this.isMissing = false;
            this.formula = this.whereConditionPrefix + conditionSelected;
            $('.mat-step-header .mat-step-icon-selected, .mat-step-header .mat-step-icon-state-done, .mat-step-header .mat-step-icon-state-edit').css("background-color", "green")
            this.sharedDataService.setFormula(['where'], conditionSelected);
            let conditionObj = [{
              "condition_id": 0,
              "condition_name": this.columnName,
              "table_used": this.conditionTables,
              "columns_used_condition": this.selectedColumns,
              "condition_formula": conditionSelected,
              "applied_flag_condition": true,
              "condition_json": this.createFormula
            }];
            if (this.sharedDataService.getExistingCondition().length) {
              conditionObj[0].condition_id = this.sharedDataService.getExistingCondition()[0].condition_id;
            }
            if (this.columnName !== '') {
              this.sharedDataService.setConditionData(conditionObj);
              console.log(this.columnName,conditionObj);              
            }
            let keyValue = this.groupBy(this.createFormula, 'tableId');
            this.sharedDataService.setNewConditionData(keyValue, this.columnName);
          }
        }
      } else {
        this.toasterService.error("Invalid Formula");
      }
    }
  }

  private groupBy(arr: any, attr: string) {   // creates an obj with slId as key and related rows as values
    return arr.reduce(function (rv, x) {
      (rv[x[attr]] = rv[x[attr]] || []).push(x);
      return rv;
    }, {});
  }

  public reset() {
    this.columnName = '';
    this.sharedDataService.setFormula(['where'], '');
    let conditionObj = [];
    this.sharedDataService.setConditionData(conditionObj);
  }

  public uploadFile(event: any, con: any, index) {  // function to upload excel
    let filesData = event.target.files[0];
    XlsxPopulate.fromDataAsync(filesData)
      .then(workbook => {
        let value = workbook.sheet(0).range("A1:A1000").value();
        // this.excelValues = [];
        // this.excelValues.push(value);
        let excelValues = [];
        excelValues.push(value);
        let list = [];
        // this.excelValues.forEach(element => {
        excelValues.forEach(element => {
          element.forEach(data => {
            data.forEach(d => {
              if (typeof d !== "undefined") {
                list.push(d);
              }
            });
          });
        });
        this.values = list;
        let valueString = '';
        if (typeof this.values[0] === "number") {
          // this.valueString = `( ${this.values} )`;
           valueString = `( ${this.values} )`;
        } else if (typeof (this.values[0]) === "string") {
          // this.uploadData = list.map(t => `'${t}'`);
          // this.valueString = `( ${this.uploadData} )`;
          let uploadData = list.map(t => `'${t}'`);
          valueString = `( ${uploadData} )`;
        }
        con.values = valueString;
        this.validateFormula();
        event.target.value = '';
      })
  }

  public triggerFileBtn(index) {
    document.getElementById("valueInput" + index).click();
  }

  private removeDeletedTableData(data) {
    for (let key in data) {
      if (!(this.selectedTables.find(table =>
        key.includes(table['table']['select_table_id'].toString())
      ))) {
        delete data[key];
      }
    }
    if (this.isObjEmpty(data)) {
      this.createFormula = this.addColumnBegin();
    } else {
      this.createFormula = [];
    }
    for (let d in data) {
      this.createFormula.push(...data[d]);
    }
  }

  private isObjEmpty(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  // public getExistingList(value: string) {
  //   return this.cachedConditions.filter(option =>
  //     option['condition_name'].toLowerCase().includes(value.toLowerCase())
  //   )
  // }

  public getConditions(callback = null) {
    let tableIds;
    tableIds = this.tableIds.map(t => t.toString());
    tableIds = [...new Set(tableIds)]
    this.addConditions.fetchCondition(tableIds).subscribe(res => {
      this.condition = res['existing_conditions'];
      this.cachedConditions = this.condition.slice();
      // this.isLoading = false;
      if (callback) {
        callback();
      }
    })
  }

  public onSelect(conditionVal, conditionId, item, itemObj) {   // when an item is selected from the existingList
    itemObj.checked = item.checked;
    let obj = this.createFormula[0];
    if (obj.attribute == '' && obj.values == '' && obj.condition == '' && obj.operator == '') {
      this.createFormula.splice(this.createFormula[0], 1);
    }
    this.selectedObj = this.condition.find(x =>
      x.condition_name.trim().toLowerCase() == conditionVal.trim().toLowerCase()
    ).condition_json;
    let selectedId = conditionId;
    this.selectedObj.forEach(t => t.conditionId = selectedId);
    if (item.checked == true) {
      for (let i = 0; i < this.selectedObj.length; ++i) {
        this.createFormula.push(this.selectedObj[i]);
        // }
      }
    } else {
      for (let i = 0; i < this.selectedObj.length; ++i) {
        if (this.createFormula.includes(this.selectedObj[i])) {
          this.createFormula.splice(this.selectedObj[i], 1);
        }
      }
    }
    if (!this.createFormula.length) {
      this.addColumn();
    }
  }

  public deleteCondition(id) {   // delete a selected condition from existingList
    Utils.showSpinner();
    this.addConditions.delCondition(id).subscribe(response => {
      this.getConditions(() => {
        Utils.hideSpinner();
        this.toasterService.success("Condition deleted Successfully");
        for (let i = 0; i < this.selectedObj.length; ++i) {
          if (this.createFormula.includes(this.selectedObj[i])) {
            this.createFormula.splice(this.selectedObj[i], 1);
          }
        }
      });
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    });
  }

  public inputValue(value) {
    if ((value || '').trim()) {
      this.oldValue = value.split(/(\s+)/).filter(e => e.trim().length > 0);
      this.oldValue.forEach(element => {
        element + ' ';
      });
      this.current = this.oldValue[this.oldValue.length - 1];
      this.results = this.getSearchedInput(this.oldValue[this.oldValue.length - 1]);
    } else {
      this.results = [{ groupName: 'Functions', values: [] }, { groupName: 'Columns', values: [] }, { groupName: 'ListValues', values: [] }];
    }
  }

  private getSearchedInput(value: any) {
    let functionArr = [], columnList = [];
    for (let key in this.functions) {
      functionArr.push(
        ...this.functions[key].filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    columnList = this.columns.filter(element => {
      return element.toLowerCase().includes(value.toLowerCase())
    });
    return [{ groupName: 'Functions', values: functionArr }, { groupName: 'Columns', values: columnList }, { groupName: 'Values', values: this.valueList}];
  }

  public onSelectionChanged(event, con, type) {
    let column = event.option.value.slice(event.option.value.indexOf(".") + 1);
    let id = [];
    if (type == 'attribute') {
      id = this.tables.map(table => {
        if (event.option.value.split('.')[0] === table.alias)
          return table.id;
      })
      this.fetchLov(id[0], column);
      console.log("event", event.option.value, event, column, id[0]);
    }    
    let index = this.oldValue.length > 0 ? this.oldValue.length - 1 : 0;
    if (this.isColumn(event.option.value)) {
      this.getDetails(event.option.value, con);
    }
    this.oldValue[index] = event.option.value + '  ';
    if (type == 'attribute') {
      con.attribute = (this.oldValue.join(' '));
    } else {
      con.values = (this.oldValue.join(' '));
    }
  }

  public getDetails(event, con) {
    let ids = [];
    ids = this.tables.map(table => {
      if (event.split('.')[0] === table.alias)
        return table.id;
    })
    this.selectedColumns.push(event.split('.')[1])
    this.conditionTables.push(...ids);
    let unique = [...new Set(this.conditionTables)];
    this.selectedColumns = [...new Set(this.selectedColumns)]
    unique = unique.filter(element => {
      return element !== undefined
    });
    this.conditionTables = unique;
    this.rowUsedTable = unique;
    con.tableId = this.rowUsedTable;
    console.log(con.tableId,"con.tableId");    
  }

  private isColumn(item) {
    return this.columns.map(col => col.toUpperCase().trim()).includes(item.toUpperCase().trim());
  }

  requiredFields() {  
    let obj = this.createFormula[0];
    if ( obj && obj.attribute == '' && obj.condition == '' && obj.conditionId == '' && obj.operator == '' && obj.tableId == '' && obj.values == '') {
      return true;
    }
  }
}